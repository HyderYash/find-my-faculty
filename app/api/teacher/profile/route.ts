import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Teacher } from '@/app/models/User';
import connectDB from '@/app/lib/db/mongodb';
import { withErrorHandling, withAuth, withRole } from '@/app/lib/api/middleware';

async function getProfile(req: NextRequest) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const teacher = await Teacher.findById(session?.user.id)
        .select('-password')
        .lean();

    if (!teacher) {
        return NextResponse.json(
            { error: 'Teacher not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(teacher);
}

async function updateProfile(req: NextRequest) {
    const body = await req.json();
    const { fullName, roomNumber } = body;

    await connectDB();

    const session = await getServerSession(authOptions);
    const teacher = await Teacher.findById(session?.user.id);

    if (!teacher) {
        return NextResponse.json(
            { error: 'Teacher not found' },
            { status: 404 }
        );
    }

    if (fullName) teacher.fullName = fullName;
    if (roomNumber) teacher.roomNumber = roomNumber;

    await teacher.save();
    return NextResponse.json(teacher);
}

export const GET = withErrorHandling(withAuth(withRole('teacher', getProfile)));
export const PUT = withErrorHandling(withAuth(withRole('teacher', updateProfile))); 