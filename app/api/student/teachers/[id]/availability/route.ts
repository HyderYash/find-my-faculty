import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Teacher } from '@/app/models/User';
import Appointment from '@/app/models/Appointment';
import connectDB from '@/app/lib/db/mongodb';
import { startOfDay, endOfMonth, addDays, format } from 'date-fns';
import { TeacherProfile } from '@/app/models/types';
import { Types } from 'mongoose';

interface OfficeHour {
    day: string;
    startTime: string;
    endTime: string;
}

interface TeacherDocument {
    _id: Types.ObjectId;
    fullName: string;
    roomNumber: string;
    officeHours: OfficeHour[];
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

        if (session.user.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const teacherId = params.id;
        await connectDB();

        // Get teacher's office hours
        const teacherDoc = await Teacher.findById(teacherId)
            .select('fullName roomNumber officeHours')
            .lean();

        if (!teacherDoc) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        // Type assertion after validation
        const teacher = teacherDoc as unknown as TeacherDocument;

        // Convert office hours to calendar events
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const events = [];

        for (let date = today; date <= nextMonth; date = addDays(date, 1)) {
            const dayOfWeek = format(date, 'EEEE');
            const officeHour = teacher.officeHours?.find(h => h.day === dayOfWeek);

            if (officeHour) {
                const dateStr = format(date, 'yyyy-MM-dd');
                const event = {
                    title: `Office Hours: ${teacher.fullName}`,
                    start: `${dateStr}T${officeHour.startTime}`,
                    end: `${dateStr}T${officeHour.endTime}`,
                    backgroundColor: '#22C55E', // bright green
                    borderColor: '#16A34A',
                    textColor: '#FFFFFF',
                    classNames: ['office-hours-event'],
                    extendedProps: {
                        isOfficeHour: true,
                        teacherId,
                        teacherName: teacher.fullName,
                        roomNumber: teacher.roomNumber,
                        description: 'Click to book a 10-minute appointment'
                    }
                };
                events.push(event);
            }
        }

        // Add booked appointments as events
        const bookedAppointments = await Appointment.find({
            teacher: teacherId,
            status: { $in: ['pending', 'accepted'] },
            startTime: { $gte: today },
            endTime: { $lte: nextMonth }
        })
            .populate('student', 'fullName')
            .lean();

        bookedAppointments.forEach(appointment => {
            events.push({
                title: appointment.status === 'pending' ? 'Pending Booking' : 'Booked',
                start: appointment.startTime,
                end: appointment.endTime,
                backgroundColor: appointment.status === 'pending' ? '#FCD34D' : '#EF4444', // yellow for pending, red for accepted
                borderColor: appointment.status === 'pending' ? '#F59E0B' : '#DC2626',
                textColor: appointment.status === 'pending' ? '#000000' : '#FFFFFF',
                classNames: ['booked-event'],
                extendedProps: {
                    isBooked: true,
                    status: appointment.status,
                    studentName: (appointment.student as any).fullName,
                    description: `Booked by ${(appointment.student as any).fullName}`
                }
            });
        });

        return NextResponse.json({
            teacher: {
                id: teacher._id,
                fullName: teacher.fullName,
                roomNumber: teacher.roomNumber
            },
            events
        });
    } catch (error) {
        console.error('Error in teacher availability GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 