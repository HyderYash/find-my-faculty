'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface TimeSlot {
    _id?: string;
    day: string;
    startTime: string;
    endTime: string;
}

interface AppointmentRequest {
    _id: string;
    student: {
        fullName: string;
        prn: string;
        stream: string;
    };
    startTime: string;
    endTime: string;
    reason: string;
    status: 'pending' | 'accepted' | 'declined';
}

interface TeacherProfile {
    fullName: string;
    email: string;
    roomNumber: string;
    officeHours: TimeSlot[];
}

export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingHours, setEditingHours] = useState<TimeSlot[]>([]);
    const [responseNote, setResponseNote] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchTeacherProfile();
        fetchAppointments();
    }, []);

    const fetchTeacherProfile = async () => {
        try {
            const response = await fetch('/api/teacher/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
            setEditingHours(data.officeHours);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/teacher/appointments');
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleOfficeHoursChange = (index: number, field: string, value: string) => {
        const newHours = [...editingHours];
        newHours[index] = { ...newHours[index], [field]: value };
        setEditingHours(newHours);
    };

    const addOfficeHours = () => {
        setEditingHours([...editingHours, { day: 'Monday', startTime: '09:00', endTime: '17:00' }]);
    };

    const removeOfficeHours = (index: number) => {
        setEditingHours(editingHours.filter((_, i) => i !== index));
    };

    const saveOfficeHours = async () => {
        try {
            const response = await fetch('/api/teacher/office-hours', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ officeHours: editingHours }),
            });

            if (!response.ok) throw new Error('Failed to update office hours');

            const data = await response.json();
            setProfile({ ...profile!, officeHours: data.officeHours });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating office hours:', error);
        }
    };

    const handleAppointmentResponse = async (appointmentId: string, status: 'accepted' | 'declined') => {
        try {
            const response = await fetch(`/api/teacher/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, note: responseNote }),
            });

            if (!response.ok) throw new Error('Failed to update appointment');

            fetchAppointments();
            setResponseNote('');
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    if (!profile) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Profile Section */}
            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    <div className="px-4 py-2 bg-accent/10 rounded-lg">
                        <span className="text-accent font-medium">Room {profile.roomNumber}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="text-lg text-foreground">{profile.fullName}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg text-foreground">{profile.email}</p>
                    </div>
                </div>
            </div>

            {/* Office Hours Section */}
            <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Office Hours</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="modern-button-accent"
                    >
                        {isEditing ? 'Cancel' : 'Edit Hours'}
                    </button>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        {editingHours.map((slot, index) => (
                            <div key={index} className="flex items-center space-x-4 bg-card/50 p-4 rounded-lg border border-border/50">
                                <select
                                    value={slot.day}
                                    onChange={(e) => handleOfficeHoursChange(index, 'day', e.target.value)}
                                    className="modern-select flex-1"
                                >
                                    {days.map((day) => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) => handleOfficeHoursChange(index, 'startTime', e.target.value)}
                                    className="modern-input w-32"
                                />
                                <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => handleOfficeHoursChange(index, 'endTime', e.target.value)}
                                    className="modern-input w-32"
                                />
                                <button
                                    onClick={() => removeOfficeHours(index)}
                                    className="text-destructive hover:text-destructive/80 p-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={addOfficeHours}
                                className="modern-button-secondary"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add More Hours
                            </button>
                            <button
                                onClick={saveOfficeHours}
                                className="modern-button-primary"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.officeHours.map((slot, index) => (
                            <div key={index} className="bg-card/50 p-4 rounded-lg border border-border/50 flex justify-between items-center">
                                <span className="font-medium text-foreground">{slot.day}</span>
                                <span className="text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Appointment Requests Section */}
            <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Appointment Requests</h2>
                <div className="space-y-6">
                    {appointments.map((appointment) => (
                        <div key={appointment._id} className="bg-card/50 rounded-lg border border-border/50 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-foreground">{appointment.student.fullName}</h3>
                                            <p className="text-sm text-muted-foreground">PRN: {appointment.student.prn} • {appointment.student.stream}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${appointment.status === 'pending' ? 'bg-warning/20 text-warning' :
                                            appointment.status === 'accepted' ? 'bg-success/20 text-success' :
                                                'bg-destructive/20 text-destructive'}`}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Time Slot</p>
                                        <p className="text-foreground">
                                            {format(new Date(appointment.startTime), 'PPp')} - {format(new Date(appointment.endTime), 'p')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Reason</p>
                                        <p className="text-foreground">{appointment.reason}</p>
                                    </div>
                                </div>
                            </div>
                            {appointment.status === 'pending' && (
                                <div className="border-t border-border/50 bg-background/50 p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Response Note (Optional)
                                        </label>
                                        <textarea
                                            value={responseNote}
                                            onChange={(e) => setResponseNote(e.target.value)}
                                            className="modern-input"
                                            rows={2}
                                            placeholder="Add a note to your response..."
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleAppointmentResponse(appointment._id, 'accepted')}
                                            className="modern-button-primary flex-1"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAppointmentResponse(appointment._id, 'declined')}
                                            className="modern-button-secondary flex-1"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <div className="text-center py-12 bg-card/50 rounded-lg border border-border/50">
                            <div className="text-4xl mb-4">📅</div>
                            <p className="text-lg font-medium text-foreground">No Appointment Requests</p>
                            <p className="text-muted-foreground">You'll see appointment requests here when students book slots.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 