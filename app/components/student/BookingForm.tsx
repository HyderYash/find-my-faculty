'use client';

import { useState, useEffect } from 'react';
import { format, addMinutes, parse, isWithinInterval } from 'date-fns';

interface BookingFormProps {
    teacherId: string;
    teacherName: string;
    selectedStartTime: Date;
    selectedEndTime: Date;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookingForm({
    teacherId,
    teacherName,
    selectedStartTime,
    selectedEndTime,
    onClose,
    onSuccess
}: BookingFormProps) {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<{ start: Date; end: Date; }[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; } | null>(null);
    const [bookedSlots, setBookedSlots] = useState<{ start: Date; end: Date; }[]>([]);

    useEffect(() => {
        // Fetch booked slots for this teacher and time range
        const fetchBookedSlots = async () => {
            try {
                const response = await fetch(`/api/student/teachers/${teacherId}/booked-slots?start=${selectedStartTime.toISOString()}&end=${selectedEndTime.toISOString()}`);
                if (!response.ok) throw new Error('Failed to fetch booked slots');
                const data = await response.json();
                setBookedSlots(data.bookedSlots.map((slot: any) => ({
                    start: new Date(slot.start),
                    end: new Date(slot.end)
                })));
            } catch (error) {
                console.error('Error fetching booked slots:', error);
                setBookedSlots([]);
            }
        };

        fetchBookedSlots();
    }, [teacherId, selectedStartTime, selectedEndTime]);

    useEffect(() => {
        // Generate consecutive 10-minute time slots between selectedStartTime and selectedEndTime
        const slots = [];
        let currentTime = new Date(selectedStartTime);
        const endTime = new Date(selectedEndTime);

        // Ensure we're working with fresh Date objects
        currentTime = new Date(currentTime.getTime());
        const endTimeMs = endTime.getTime();

        while (currentTime.getTime() < endTimeMs) {
            const slotStart = new Date(currentTime.getTime());
            const slotEnd = new Date(currentTime.getTime() + 10 * 60000); // Add 10 minutes

            // Check if this slot overlaps with any booked slots
            const isSlotAvailable = !bookedSlots.some(bookedSlot => {
                const bookedStart = new Date(bookedSlot.start).getTime();
                const bookedEnd = new Date(bookedSlot.end).getTime();
                const slotStartMs = slotStart.getTime();
                const slotEndMs = slotEnd.getTime();

                return (slotStartMs >= bookedStart && slotStartMs < bookedEnd) ||
                    (slotEndMs > bookedStart && slotEndMs <= bookedEnd) ||
                    (slotStartMs <= bookedStart && slotEndMs >= bookedEnd);
            });

            if (slotEnd.getTime() <= endTimeMs && isSlotAvailable) {
                slots.push({
                    start: slotStart,
                    end: slotEnd
                });
            }

            // Move to next slot
            currentTime = new Date(slotEnd);
        }

        setAvailableTimeSlots(slots);
        // Set the first available slot as default if there are any slots
        if (slots.length > 0) {
            setSelectedSlot(slots[0]);
        } else {
            setSelectedSlot(null);
            setError('No available time slots found for this period');
        }
    }, [selectedStartTime, selectedEndTime, bookedSlots]);

    const validateForm = () => {
        if (!selectedSlot) {
            setError('Please select a time slot');
            return false;
        }

        const words = reason.trim().split(/\s+/);
        if (words.length > 20) {
            setError('Booking reason must not exceed 20 words');
            return false;
        }
        if (words.length < 3) {
            setError('Please provide a more detailed reason (at least 3 words)');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !selectedSlot) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/student/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId,
                    startTime: selectedSlot.start.toISOString(),
                    endTime: selectedSlot.end.toISOString(),
                    reason
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to book appointment');
            }

            onSuccess();
        } catch (error: any) {
            setError(error.message || 'Failed to book appointment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        className="glass-card w-full max-w-lg p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Book Appointment</h2>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1 transition-colors duration-200"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="bg-background/50 p-4 rounded-xl border border-border mb-6">
                                <p className="text-base text-foreground mb-3">
                                    <span className="font-semibold">Faculty:</span> {teacherName}
                                </p>
                                <p className="text-base text-foreground">
                                    <span className="font-semibold">Date:</span> {format(selectedStartTime, 'PPP')}
                                </p>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="mt-6">
                                <label className="block text-base font-semibold text-foreground mb-3">
                                    Available Time Slots
                                    <span className="text-base font-normal text-muted-foreground ml-2">(10-minute duration)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-background/50 p-4 rounded-xl border border-border">
                                    {availableTimeSlots.length > 0 ? (
                                        availableTimeSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`p-3 text-base rounded-lg border transition-all duration-200 ${selectedSlot === slot
                                                        ? 'border-accent bg-accent/10 text-accent shadow-sm ring-2 ring-accent ring-opacity-50'
                                                        : 'border-border hover:border-border/80 hover:bg-background hover:shadow-sm'
                                                    }`}
                                            >
                                                {format(slot.start, 'h:mm a')}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-4 text-muted-foreground">
                                            No available slots found
                                        </div>
                                    )}
                                </div>
                                {selectedSlot && (
                                    <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                                        <p className="text-base text-success">
                                            <span className="font-semibold">Selected time:</span>{' '}
                                            {format(selectedSlot.start, 'h:mm a')} - {format(selectedSlot.end, 'h:mm a')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-background rounded-lg">
                                <label className="block text-base font-semibold text-foreground mb-2">
                                    Reason for Appointment
                                    <span className="text-base font-normal text-muted-foreground ml-2">(3-20 words)</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
                                        className="modern-input resize-none"
                                        placeholder="Example: Discuss project requirements and clarify doubts about the assignment..."
                                    />
                                    <div className="absolute bottom-2 right-2 text-sm text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
                                        {reason.trim().split(/\s+/).filter(Boolean).length}/20 words
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-base rounded-lg p-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="modern-button-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedSlot}
                                    className="modern-button-primary"
                                >
                                    {isLoading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
} 