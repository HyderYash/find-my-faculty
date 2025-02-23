export interface AuthValidationResult {
    isValid: boolean;
    error?: string;
}

export function validatePassword(password: string): AuthValidationResult {
    if (password.length < 8) {
        return {
            isValid: false,
            error: 'Password must be at least 8 characters long'
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one uppercase letter'
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one lowercase letter'
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one number'
        };
    }

    if (!/[!@#$%^&*]/.test(password)) {
        return {
            isValid: false,
            error: 'Password must contain at least one special character (!@#$%^&*)'
        };
    }

    return { isValid: true };
}

export function validateEmail(email: string): AuthValidationResult {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            error: 'Please enter a valid email address'
        };
    }

    return { isValid: true };
}

export function validatePRN(prn: string): AuthValidationResult {
    if (!/^\d{8}$/.test(prn)) {
        return {
            isValid: false,
            error: 'PRN must be exactly 8 digits'
        };
    }

    return { isValid: true };
}

export function validateStream(stream: string): AuthValidationResult {
    const validStreams = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil'
    ];

    if (!validStreams.includes(stream)) {
        return {
            isValid: false,
            error: 'Please select a valid stream'
        };
    }

    return { isValid: true };
}

export function validateRoomNumber(roomNumber: string): AuthValidationResult {
    if (!/^[A-Z0-9-]{2,10}$/.test(roomNumber)) {
        return {
            isValid: false,
            error: 'Room number must be 2-10 characters (letters, numbers, or hyphens)'
        };
    }

    return { isValid: true };
}

export function validateOfficeHours(officeHours: { day: string; startTime: string; endTime: string; }[]): AuthValidationResult {
    if (!officeHours.length) {
        return {
            isValid: false,
            error: 'At least one office hour slot is required'
        };
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const slot of officeHours) {
        if (!validDays.includes(slot.day)) {
            return {
                isValid: false,
                error: 'Invalid day selected'
            };
        }

        const start = parseInt(slot.startTime.replace(':', ''));
        const end = parseInt(slot.endTime.replace(':', ''));

        if (start >= end) {
            return {
                isValid: false,
                error: 'End time must be after start time'
            };
        }
    }

    return { isValid: true };
} 