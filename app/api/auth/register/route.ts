import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Teacher, Student } from '@/app/models/User';
import connectDB from '@/app/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, fullName, role, ...additionalFields } = body;

        // Validate required fields
        if (!email || !password || !fullName || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectDB();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const baseUserData = {
            email,
            password: hashedPassword,
            fullName,
            role,
        };

        let user;

        if (role === 'teacher') {
            const { roomNumber, officeHours } = additionalFields;

            if (!roomNumber || !officeHours) {
                return NextResponse.json(
                    { error: 'Missing teacher-specific fields' },
                    { status: 400 }
                );
            }

            user = await Teacher.create({
                ...baseUserData,
                roomNumber,
                officeHours,
            });
        } else if (role === 'student') {
            const { prn, stream } = additionalFields;

            if (!prn || !stream) {
                return NextResponse.json(
                    { error: 'Missing student-specific fields' },
                    { status: 400 }
                );
            }

            user = await Student.create({
                ...baseUserData,
                prn,
                stream,
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        // Remove password from response
        const userResponse = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            ...additionalFields,
        };

        return NextResponse.json(userResponse, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Email or PRN already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 