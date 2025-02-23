'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        roomNumber: '',
        officeHours: [{ day: 'Monday', startTime: '09:00', endTime: '17:00', repeat: true }]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const days = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' }
    ];

    const timeSlots = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? '00' : '30';
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;
    });

    const handleOfficeHoursChange = (index: number, field: string, value: string | boolean) => {
        const newOfficeHours = [...formData.officeHours];
        newOfficeHours[index] = { ...newOfficeHours[index], [field]: value };
        setFormData({ ...formData, officeHours: newOfficeHours });
    };

    const addOfficeHours = () => {
        setFormData({
            ...formData,
            officeHours: [...formData.officeHours, { day: 'Monday', startTime: '09:00', endTime: '17:00', repeat: true }]
        });
    };

    const removeOfficeHours = (index: number) => {
        const newOfficeHours = formData.officeHours.filter((_, i) => i !== index);
        setFormData({ ...formData, officeHours: newOfficeHours });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'teacher'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/auth/signin?registered=true');
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link
                    href="/auth/register"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to role selection
                </Link>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="glass-card p-8 shadow-2xl backdrop-blur-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Form */}
                        <div>
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Teacher Registration</h2>
                                    <p className="text-muted-foreground">Create your faculty account</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-primary transition-colors">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="modern-input focus:ring-primary"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-primary transition-colors">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="modern-input focus:ring-primary"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-primary transition-colors">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="modern-input focus:ring-primary"
                                            placeholder="Create a password"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-primary transition-colors">
                                            Room Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.roomNumber}
                                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                            className="modern-input focus:ring-primary"
                                            placeholder="Enter your room number"
                                        />
                                    </div>
                                </div>

                                {/* Office Hours Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-foreground">Office Hours</h3>
                                        <button
                                            type="button"
                                            onClick={addOfficeHours}
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Add Time Slot
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.officeHours.map((slot, index) => (
                                            <div key={index} className="p-6 rounded-xl bg-card shadow-lg border border-border/50 hover:border-primary/30 transition-colors">
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                                Day
                                                            </label>
                                                            <select
                                                                value={slot.day}
                                                                onChange={(e) => handleOfficeHoursChange(index, 'day', e.target.value)}
                                                                className="modern-select focus:ring-primary w-full"
                                                            >
                                                                {days.map(day => (
                                                                    <option key={day.value} value={day.value}>{day.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                                Start Time
                                                            </label>
                                                            <select
                                                                value={slot.startTime}
                                                                onChange={(e) => handleOfficeHoursChange(index, 'startTime', e.target.value)}
                                                                className="modern-select focus:ring-primary w-full"
                                                            >
                                                                {timeSlots.map(time => (
                                                                    <option key={time} value={time}>{time}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                                End Time
                                                            </label>
                                                            <select
                                                                value={slot.endTime}
                                                                onChange={(e) => handleOfficeHoursChange(index, 'endTime', e.target.value)}
                                                                className="modern-select focus:ring-primary w-full"
                                                            >
                                                                {timeSlots.map(time => (
                                                                    <option key={time} value={time}>{time}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={slot.repeat}
                                                                onChange={(e) => handleOfficeHoursChange(index, 'repeat', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                            <span className="ms-3 text-sm font-medium text-muted-foreground">Weekly</span>
                                                        </label>
                                                        {formData.officeHours.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOfficeHours(index)}
                                                                className="inline-flex items-center px-3 py-1.5 text-sm text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-md transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                Remove Slot
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {errors.submit && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-4 mt-4">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.submit}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right Column - Information */}
                        <div className="hidden lg:block">
                            <div className="sticky top-8 space-y-8">
                                <div className="bg-accent/5 rounded-lg p-6 border border-accent/10">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Why Register as a Teacher?</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Easily manage your office hours and availability</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Accept or decline appointment requests</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Get instant notifications for new appointments</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Maintain an organized schedule of student meetings</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Tips for Office Hours</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li>• Set consistent hours for better student engagement</li>
                                        <li>• Consider both morning and afternoon slots</li>
                                        <li>• Allow breaks between appointments</li>
                                        <li>• Update your schedule regularly</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 