export type UserRole = 'teacher' | 'student';

export type AppointmentStatus = 'pending' | 'accepted' | 'declined';

export interface TimeSlot {
    day: string;
    startTime: string;
    endTime: string;
}

export interface BaseUser {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeacherProfile extends BaseUser {
    role: 'teacher';
    roomNumber: string;
    officeHours: TimeSlot[];
}

export interface StudentProfile extends BaseUser {
    role: 'student';
    prn: string;
    stream: string;
}

export interface Appointment {
    teacher: string; // Teacher ID
    student: string; // Student ID
    startTime: Date;
    endTime: Date;
    reason: string;
    status: AppointmentStatus;
    teacherNote?: string;
    createdAt: Date;
    updatedAt: Date;
} 