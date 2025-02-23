import mongoose from 'mongoose';
import { Appointment, AppointmentStatus } from './types';

const appointmentSchema = new mongoose.Schema<Appointment>({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, 'Booking reason cannot exceed 20 words'],
        validate: {
            validator: function (value: string) {
                // Approximate word count by splitting on whitespace
                return value.trim().split(/\s+/).length <= 20;
            },
            message: 'Booking reason must not exceed 20 words'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    teacherNote: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true,
});

// Validate 10-minute maximum duration
appointmentSchema.pre('save', function (next) {
    const durationInMinutes = (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
    if (durationInMinutes > 10) {
        next(new Error('Appointment duration cannot exceed 10 minutes'));
    } else if (durationInMinutes <= 0) {
        next(new Error('End time must be after start time'));
    } else {
        next();
    }
});

// Index to prevent overlapping appointments for the same teacher
appointmentSchema.index({
    teacher: 1,
    startTime: 1,
    endTime: 1,
}, {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'accepted'] } }
});

const Appointment = mongoose.models.Appointment || mongoose.model<Appointment>('Appointment', appointmentSchema);

export default Appointment; 