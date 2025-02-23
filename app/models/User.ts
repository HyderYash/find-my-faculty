import mongoose from 'mongoose';
import { BaseUser, UserRole } from './types';

const timeSlotSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema<BaseUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['teacher', 'student'],
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
}, {
    timestamps: true,
    discriminatorKey: 'role',
});

userSchema.index({ role: 1, fullName: 1 });

// Only create models if they don't exist
const User = mongoose.models.User || mongoose.model<BaseUser>('User', userSchema);

// Teacher discriminator schema
const teacherSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    officeHours: [timeSlotSchema],
});

teacherSchema.path('officeHours').validate(function (hours: any[]) {
    if (!hours.length) return false;
    return hours.every(slot => {
        const start = parseInt(slot.startTime.replace(':', ''));
        const end = parseInt(slot.endTime.replace(':', ''));
        return start < end;
    });
}, 'Invalid office hours configuration');

// Student discriminator schema
const studentSchema = new mongoose.Schema({
    prn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    stream: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
});

// Only create discriminators if they don't exist
const Teacher = User.discriminators?.teacher || User.discriminator('teacher', teacherSchema);
const Student = User.discriminators?.student || User.discriminator('student', studentSchema);

export { User, Teacher, Student }; 