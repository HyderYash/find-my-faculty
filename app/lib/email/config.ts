import nodemailer from 'nodemailer';

// Create a transporter using Gmail
export const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // Use App Password for Gmail
    }
});

// Email templates for different notification types
export const emailTemplates = {
    appointmentCreated: (teacherName: string, date: string, time: string, reason: string) => ({
        subject: 'New Appointment Request',
        html: `
            <h2>New Appointment Request</h2>
            <p>You have a new appointment request with ${teacherName}.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please check your dashboard for more details.</p>
        `
    }),
    appointmentStatusUpdated: (status: string, teacherName: string, date: string, time: string, note?: string) => ({
        subject: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
            <h2>Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <p>Your appointment with ${teacherName} has been ${status}.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
            <p>Please check your dashboard for more details.</p>
        `
    }),
    appointmentCancelled: (teacherName: string, date: string, time: string) => ({
        subject: 'Appointment Cancelled',
        html: `
            <h2>Appointment Cancelled</h2>
            <p>Your appointment with ${teacherName} has been cancelled.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Please check your dashboard for more details.</p>
        `
    })
}; 