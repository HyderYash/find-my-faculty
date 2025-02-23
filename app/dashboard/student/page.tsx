'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import BookingForm from '@/app/components/student/BookingForm';

interface Teacher {
    _id: string;
    fullName: string;
    roomNumber: string;
}

interface CalendarEvent {
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps: {
        isOfficeHour?: boolean;
        isBooked?: boolean;
        teacherId?: string;
        teacherName?: string;
        roomNumber?: string;
        status?: string;
        studentName?: string;
        description?: string;
    };
}

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        start: Date;
        end: Date;
    } | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedTeacher) {
            fetchTeacherAvailability();
        } else {
            setEvents([]);
        }
    }, [selectedTeacher]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('/api/student/teachers');
            if (!response.ok) throw new Error('Failed to fetch teachers');
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchTeacherAvailability = async () => {
        if (!selectedTeacher) return;

        try {
            const response = await fetch(`/api/student/teachers/${selectedTeacher._id}/availability`);
            if (!response.ok) throw new Error('Failed to fetch availability');
            const data = await response.json();

            // Process events to create full-height booked slots
            const processedEvents = data.events.map((event: any) => {
                if (event.extendedProps.isBooked) {
                    return {
                        ...event,
                        display: 'background',
                        backgroundColor: event.status === 'pending' ? 'rgba(253, 224, 71, 0.55)' : 'rgba(239, 68, 68, 0.55)',
                        classNames: ['booked-slot']
                    };
                }
                return {
                    ...event,
                    classNames: ['office-hour-slot']
                };
            });

            setEvents(processedEvents);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const handleEventClick = (info: any) => {
        const event = info.event;

        // If the slot is already booked, show a message and return
        if (event.extendedProps.isBooked) {
            alert(`This time slot is already ${event.extendedProps.status}${event.extendedProps.studentName ? ` by ${event.extendedProps.studentName}` : ''
                }`);
            return;
        }

        // Only allow booking during office hours
        if (event.extendedProps.isOfficeHour) {
            const now = new Date();
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            // Don't allow booking if the entire office hour is in the past
            if (eventEnd < now) {
                alert('Cannot book appointments for past office hours');
                return;
            }

            // Use the full office hour range for available slots
            let slotStart = new Date(Math.max(eventStart.getTime(), now.getTime()));

            // Round up to the next 10-minute slot if needed
            const minutes = slotStart.getMinutes();
            const remainder = minutes % 10;
            if (remainder > 0) {
                slotStart.setMinutes(slotStart.getMinutes() + (10 - remainder));
                slotStart.setSeconds(0);
                slotStart.setMilliseconds(0);
            }

            // Check if there's still time available in the office hours
            if (slotStart >= eventEnd) {
                alert('No available slots remaining in these office hours');
                return;
            }

            setSelectedSlot({
                start: slotStart,
                end: eventEnd // Pass the full end time of office hours
            });
            setShowBookingForm(true);
        }
    };

    const handleBookingSuccess = () => {
        setShowBookingForm(false);
        setSelectedSlot(null);
        fetchTeacherAvailability(); // Refresh the calendar
    };

    return (
        <div className="space-y-8">
            {/* Teacher Selection */}
            <div className="glass-card p-6" role="region" aria-labelledby="teacher-selection">
                <h2 id="teacher-selection" className="text-2xl font-bold text-foreground mb-6">Select Faculty Member</h2>
                <select
                    value={selectedTeacher?._id || ''}
                    onChange={(e) => {
                        const teacher = teachers.find(t => t._id === e.target.value);
                        setSelectedTeacher(teacher || null);
                    }}
                    className="modern-select"
                    aria-label="Select a faculty member"
                >
                    <option value="">Choose a faculty member</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.fullName} - Room {teacher.roomNumber}
                        </option>
                    ))}
                </select>
            </div>

            {/* Calendar View */}
            {selectedTeacher && (
                <div className="glass-card p-6" role="region" aria-labelledby="calendar-view">
                    <h3 id="calendar-view" className="text-xl font-semibold text-foreground mb-4">Schedule Legend</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center p-4 rounded-lg bg-background/50 border border-border">
                            <div className="w-5 h-5 rounded-md bg-success mr-3"></div>
                            <span className="text-base font-medium text-foreground">Available Hours</span>
                        </div>
                        <div className="flex items-center p-4 rounded-lg bg-background/50 border border-border">
                            <div className="w-5 h-5 rounded-md bg-warning mr-3"></div>
                            <span className="text-base font-medium text-foreground">Pending Bookings</span>
                        </div>
                        <div className="flex items-center p-4 rounded-lg bg-background/50 border border-border">
                            <div className="w-5 h-5 rounded-md bg-destructive mr-3"></div>
                            <span className="text-base font-medium text-foreground">Booked Slots</span>
                        </div>
                    </div>
                    <div className="calendar-container" role="region" aria-label="Faculty availability calendar">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            eventClick={handleEventClick}
                            slotMinTime="09:00:00"
                            slotMaxTime="18:00:00"
                            allDaySlot={false}
                            height="auto"
                            slotDuration="00:10:00"
                            nowIndicator={true}
                            scrollTime={new Date().getHours() + ":00:00"}
                            eventContent={(arg) => {
                                if (arg.event.display === 'background') {
                                    const status = arg.event.extendedProps.status;
                                    const isBooked = status === 'accepted';
                                    return (
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            role="status"
                                            aria-label={`${status} time slot`}
                                        >
                                            <div className={`text-base font-medium px-4 py-2 rounded-lg shadow-sm backdrop-blur-sm
                                                ${isBooked
                                                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                                    : 'bg-warning/10 text-warning border border-warning/20'
                                                }`}
                                            >
                                                {isBooked ? 'Booked' : 'Pending'}
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        className="w-full h-full p-3 bg-success text-success-foreground rounded-lg shadow-sm 
                                        hover:bg-success/90 hover:scale-[1.02] transition-all duration-200"
                                        role="button"
                                        aria-label="Available office hour slot"
                                    >
                                        <div className="text-sm font-semibold">{arg.event.title}</div>
                                        {arg.event.extendedProps.description && (
                                            <div className="text-sm mt-1 opacity-90">
                                                {arg.event.extendedProps.description}
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                            eventClassNames={(arg) => [
                                'transition-all duration-200',
                                arg.event.display === 'background'
                                    ? `booked-slot ${arg.event.extendedProps.status}`
                                    : 'office-hour-slot'
                            ]}
                            slotLaneClassNames="transition-colors duration-200 hover:bg-secondary/30"
                            dayHeaderClassNames="text-base font-semibold text-foreground bg-secondary/50 py-4"
                            slotLabelClassNames="text-base font-medium text-muted-foreground"
                            viewClassNames="bg-card rounded-xl shadow-sm"
                        />
                    </div>
                </div>
            )}

            {/* Booking Form Modal */}
            {showBookingForm && selectedTeacher && selectedSlot && (
                <BookingForm
                    teacherId={selectedTeacher._id}
                    teacherName={selectedTeacher.fullName}
                    selectedStartTime={selectedSlot.start}
                    selectedEndTime={selectedSlot.end}
                    onClose={() => {
                        setShowBookingForm(false);
                        setSelectedSlot(null);
                    }}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}