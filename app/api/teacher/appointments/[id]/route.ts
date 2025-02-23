import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Appointment from '@/app/models/Appointment';
import connectDB from '@/app/lib/db/mongodb';
import { validateAppointmentStatus } from '@/app/lib/validations/appointment';
import { notificationService } from '@/app/lib/email/notificationService';

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        if (session.user.role !== 'teacher') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = params;
        const body = await req.json();
        const { status, note } = body;

        await connectDB();

        const appointment = await Appointment.findOne({
            _id: id,
            teacher: session.user.id
        }).populate('student', 'fullName email');

        if (!appointment) {
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Validate status update
        const statusValidation = validateAppointmentStatus(status, appointment.status);
        if (!statusValidation.isValid) {
            return NextResponse.json(
                { error: statusValidation.error },
                { status: 400 }
            );
        }

        // Validate note length if provided
        if (note && note.length > 200) {
            return NextResponse.json(
                { error: 'Note cannot exceed 200 characters' },
                { status: 400 }
            );
        }

        // Update appointment
        appointment.status = status;
        if (note) appointment.teacherNote = note;
        await appointment.save();

        // Populate response data
        const populatedAppointment = await appointment.populate([
            { path: 'teacher', select: 'fullName email roomNumber' },
            { path: 'student', select: 'fullName email prn stream' }
        ]);

        // Send email notification
        try {
            await notificationService.sendAppointmentStatusNotification(
                {
                    startTime: populatedAppointment.startTime,
                    endTime: populatedAppointment.endTime,
                    teacherNote: note,
                    teacher: {
                        email: populatedAppointment.teacher.email,
                        fullName: populatedAppointment.teacher.fullName
                    },
                    student: {
                        email: populatedAppointment.student.email,
                        fullName: populatedAppointment.student.fullName
                    }
                },
                status as 'accepted' | 'declined'
            );
        } catch (error) {
            console.error('Failed to send email notification:', error);
            // Continue with the response even if email fails
        }

        return NextResponse.json(populatedAppointment);
    } catch (error) {
        console.error('Error in appointment PUT:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { id } = params;
        await connectDB();

        const appointment = await Appointment.findById(id)
            .populate('teacher', 'fullName roomNumber')
            .populate('student', 'fullName prn stream')
            .lean();

        if (!appointment) {
            return NextResponse.json(
                { error: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Check if user has permission to view this appointment
        if (
            session.user.role === 'teacher' && appointment.teacher._id.toString() !== session.user.id ||
            session.user.role === 'student' && appointment.student._id.toString() !== session.user.id
        ) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('Error in appointment GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 