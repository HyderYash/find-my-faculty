import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Teacher } from '@/app/models/User';
import connectDB from '@/app/lib/db/mongodb';

export async function GET(req: NextRequest) {
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

        await connectDB();

        const teacher = await Teacher.findById(session.user.id)
            .select('officeHours')
            .lean();

        if (!teacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ officeHours: teacher.officeHours });
    } catch (error) {
        console.error('Error in office hours GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
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

        const body = await req.json();
        const { officeHours } = body;

        if (!Array.isArray(officeHours)) {
            return NextResponse.json(
                { error: 'Invalid office hours format' },
                { status: 400 }
            );
        }

        // Validate office hours format
        const isValidFormat = officeHours.every(slot =>
            slot.day &&
            slot.startTime &&
            slot.endTime &&
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(slot.day)
        );

        if (!isValidFormat) {
            return NextResponse.json(
                { error: 'Invalid office hours data' },
                { status: 400 }
            );
        }

        await connectDB();

        const teacher = await Teacher.findById(session.user.id);

        if (!teacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        teacher.officeHours = officeHours;
        await teacher.save();

        return NextResponse.json({ officeHours: teacher.officeHours });
    } catch (error) {
        console.error('Error in office hours PUT:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 