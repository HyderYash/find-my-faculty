import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Appointment from '@/app/models/Appointment';
import connectDB from '@/app/lib/db/mongodb';
import { withErrorHandling, withAuth, withRole } from '@/app/lib/api/middleware';

async function getAppointments(req: NextRequest) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const appointments = await Appointment.find({ teacher: session?.user.id })
        .populate('student', 'fullName prn stream')
        .sort({ startTime: 1 })
        .lean();

    return NextResponse.json(appointments);
}

async function updateAppointmentStatus(req: NextRequest) {
    const body = await req.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
        return NextResponse.json(
            { error: 'Invalid status' },
            { status: 400 }
        );
    }

    await connectDB();

    const session = await getServerSession(authOptions);
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        teacher: session?.user.id
    });

    if (!appointment) {
        return NextResponse.json(
            { error: 'Appointment not found' },
            { status: 404 }
        );
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate('student', 'fullName prn stream');
    return NextResponse.json(appointment);
}

export const GET = withErrorHandling(withAuth(withRole('teacher', getAppointments)));
export const PUT = withErrorHandling(withAuth(withRole('teacher', updateAppointmentStatus))); 