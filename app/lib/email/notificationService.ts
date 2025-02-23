import { format } from 'date-fns';
import { emailTransporter, emailTemplates } from './config';

export interface NotificationRecipient {
    email: string;
    fullName: string;
}

export interface AppointmentDetails {
    startTime: Date;
    endTime: Date;
    reason?: string;
    teacherNote?: string;
    teacher: NotificationRecipient;
    student: NotificationRecipient;
}

class NotificationService {
    private async sendEmail(to: string, subject: string, html: string) {
        try {
            await emailTransporter.sendMail({
                from: process.env.GMAIL_USER,
                to,
                subject,
                html
            });
            console.log(`Email sent successfully to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    async sendAppointmentCreatedNotification(appointment: AppointmentDetails) {
        const date = format(appointment.startTime, 'MMMM d, yyyy');
        const time = `${format(appointment.startTime, 'h:mm a')} - ${format(appointment.endTime, 'h:mm a')}`;

        // Notify teacher
        const teacherTemplate = emailTemplates.appointmentCreated(
            appointment.student.fullName,
            date,
            time,
            appointment.reason || ''
        );
        await this.sendEmail(appointment.teacher.email, teacherTemplate.subject, teacherTemplate.html);

        // Notify student (confirmation)
        const studentTemplate = emailTemplates.appointmentCreated(
            appointment.teacher.fullName,
            date,
            time,
            appointment.reason || ''
        );
        await this.sendEmail(appointment.student.email, studentTemplate.subject, studentTemplate.html);
    }

    async sendAppointmentStatusNotification(appointment: AppointmentDetails, status: 'accepted' | 'declined') {
        const date = format(appointment.startTime, 'MMMM d, yyyy');
        const time = `${format(appointment.startTime, 'h:mm a')} - ${format(appointment.endTime, 'h:mm a')}`;

        // Notify student
        const template = emailTemplates.appointmentStatusUpdated(
            status,
            appointment.teacher.fullName,
            date,
            time,
            appointment.teacherNote
        );
        await this.sendEmail(appointment.student.email, template.subject, template.html);
    }

    async sendAppointmentCancelledNotification(appointment: AppointmentDetails, cancelledBy: 'teacher' | 'student') {
        const date = format(appointment.startTime, 'MMMM d, yyyy');
        const time = `${format(appointment.startTime, 'h:mm a')} - ${format(appointment.endTime, 'h:mm a')}`;

        // Notify the other party
        const recipient = cancelledBy === 'teacher' ? appointment.student : appointment.teacher;
        const template = emailTemplates.appointmentCancelled(
            cancelledBy === 'teacher' ? appointment.teacher.fullName : appointment.student.fullName,
            date,
            time
        );
        await this.sendEmail(recipient.email, template.subject, template.html);
    }
}

export const notificationService = new NotificationService(); 