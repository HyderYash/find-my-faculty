import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Appointment from '@/app/models/Appointment';
import connectDB from '@/app/lib/db/mongodb';
import { validateAppointmentTime, validateBookingReason } from '@/app/lib/validations/appointment';
import { notificationService } from '@/app/lib/email/notificationService';
import { withErrorHandling, withAuth, withRole } from '@/app/lib/api/middleware';

async function getAppointments(req: NextRequest) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const appointments = await Appointment.find({ student: session?.user.id })
        .populate('teacher', 'fullName roomNumber')
        .sort({ startTime: 1 })
        .lean();

    return NextResponse.json(appointments);
}

async function createAppointment(req: NextRequest) {
    const body = await req.json();
    const { teacherId, startTime, endTime, reason } = body;

    if (!teacherId || !startTime || !endTime || !reason) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    await connectDB();

    const session = await getServerSession(authOptions);

    // Check for conflicting appointments
    const conflicting = await Appointment.findOne({
        $or: [
            {
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ],
        teacher: teacherId
    });

    if (conflicting) {
        return NextResponse.json(
            { error: 'Time slot is already booked' },
            { status: 409 }
        );
    }

    // Validate appointment time
    const timeValidation = await validateAppointmentTime(
        new Date(startTime),
        new Date(endTime),
        teacherId
    );

    if (!timeValidation.isValid) {
        return NextResponse.json(
            { error: timeValidation.error },
            { status: 400 }
        );
    }

    // Validate booking reason
    const reasonValidation = validateBookingReason(reason);
    if (!reasonValidation.isValid) {
        return NextResponse.json(
            { error: reasonValidation.error },
            { status: 400 }
        );
    }

    const appointment = await Appointment.create({
        student: session?.user.id,
        teacher: teacherId,
        startTime,
        endTime,
        reason,
        status: 'pending'
    });

    await appointment.populate('teacher', 'fullName roomNumber');

    // Send email notifications
    try {
        await notificationService.sendAppointmentCreatedNotification({
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            reason,
            teacher: {
                email: appointment.teacher.email,
                fullName: appointment.teacher.fullName
            },
            student: {
                email: appointment.student.email,
                fullName: appointment.student.fullName
            }
        });
    } catch (error) {
        console.error('Failed to send email notifications:', error);
        // Continue with the response even if email fails
    }

    return NextResponse.json(appointment);
}

export const GET = withErrorHandling(withAuth(withRole('student', getAppointments)));
export const POST = withErrorHandling(withAuth(withRole('student', createAppointment))); 