import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Appointment from '@/app/models/Appointment';
import connectDB from '@/app/lib/db/mongodb';

interface RouteContext {
    params: {
        id: string;
    };
}

export async function GET(
    req: NextRequest,
    context: RouteContext
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        if (session.user.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const teacherId = context.params.id;
        const searchParams = new URL(req.url).searchParams;
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!start || !end) {
            return NextResponse.json(
                { error: 'Start and end times are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find all booked appointments for this teacher in the given time range
        const bookedSlots = await Appointment.find({
            teacher: teacherId,
            status: { $in: ['pending', 'accepted'] },
            startTime: { $gte: new Date(start) },
            endTime: { $lte: new Date(end) }
        })
            .select('startTime endTime status')
            .lean();

        return NextResponse.json({
            bookedSlots: bookedSlots.map(slot => ({
                start: slot.startTime,
                end: slot.endTime,
                status: slot.status
            }))
        });
    } catch (error) {
        console.error('Error in booked slots GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 