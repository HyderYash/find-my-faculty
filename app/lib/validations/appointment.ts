import { differenceInMinutes } from 'date-fns';
import { Teacher } from '@/app/models/User';
import Appointment from '@/app/models/Appointment';

export interface AppointmentValidationResult {
    isValid: boolean;
    error?: string;
}

export async function validateAppointmentTime(
    startTime: Date,
    endTime: Date,
    teacherId: string
): Promise<AppointmentValidationResult> {
    // Check duration
    const duration = differenceInMinutes(endTime, startTime);
    if (duration > 10) {
        return {
            isValid: false,
            error: 'Appointment duration cannot exceed 10 minutes'
        };
    }
    if (duration <= 0) {
        return {
            isValid: false,
            error: 'End time must be after start time'
        };
    }

    // Check if time is in the past
    if (startTime < new Date()) {
        return {
            isValid: false,
            error: 'Cannot book appointments in the past'
        };
    }

    // Check teacher's office hours
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return {
            isValid: false,
            error: 'Teacher not found'
        };
    }

    const requestedDay = startTime.toLocaleDateString('en-US', { weekday: 'long' });
    const officeHour = teacher.officeHours.find(h => h.day === requestedDay);

    if (!officeHour) {
        return {
            isValid: false,
            error: 'Teacher is not available on this day'
        };
    }

    const requestedStartTime = startTime.toLocaleTimeString('en-US', { hour12: false });
    const requestedEndTime = endTime.toLocaleTimeString('en-US', { hour12: false });

    if (requestedStartTime < officeHour.startTime || requestedEndTime > officeHour.endTime) {
        return {
            isValid: false,
            error: 'Requested time is outside office hours'
        };
    }

    // Check for overlapping appointments
    const overlappingAppointment = await Appointment.findOne({
        teacher: teacherId,
        status: { $in: ['pending', 'accepted'] },
        $or: [
            {
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ]
    });

    if (overlappingAppointment) {
        return {
            isValid: false,
            error: 'This time slot is already booked'
        };
    }

    return { isValid: true };
}

export function validateBookingReason(reason: string): AppointmentValidationResult {
    const words = reason.trim().split(/\s+/);

    if (words.length > 20) {
        return {
            isValid: false,
            error: 'Booking reason cannot exceed 20 words'
        };
    }

    if (words.length < 3) {
        return {
            isValid: false,
            error: 'Please provide a more detailed reason (at least 3 words)'
        };
    }

    return { isValid: true };
}

export function validateAppointmentStatus(
    status: string,
    currentStatus: string
): AppointmentValidationResult {
    if (!['accepted', 'declined'].includes(status)) {
        return {
            isValid: false,
            error: 'Invalid status. Must be either accepted or declined'
        };
    }

    if (currentStatus !== 'pending') {
        return {
            isValid: false,
            error: 'Can only update pending appointments'
        };
    }

    return { isValid: true };
} 