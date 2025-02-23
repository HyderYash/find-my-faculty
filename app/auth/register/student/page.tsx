'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        prn: '',
        stream: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const streams = [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Information Technology', label: 'Information Technology' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Mechanical', label: 'Mechanical' },
        { value: 'Civil', label: 'Civil' }
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.prn) newErrors.prn = 'PRN is required';
        else if (!/^\d{8}$/.test(formData.prn)) newErrors.prn = 'PRN must be 8 digits';

        if (!formData.stream) newErrors.stream = 'Stream is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'student'
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
                                <div className="p-3 bg-gradient-to-br from-accent/30 to-accent/10 rounded-lg shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Student Registration</h2>
                                    <p className="text-muted-foreground">Create your student account</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-accent transition-colors">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="modern-input focus:ring-accent"
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-accent transition-colors">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="modern-input focus:ring-accent"
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-accent transition-colors">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="modern-input focus:ring-accent"
                                            placeholder="Create a password"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-accent transition-colors">
                                                PRN (8 digits)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.prn}
                                                onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                                                className="modern-input focus:ring-accent"
                                                placeholder="Enter your PRN"
                                                maxLength={8}
                                            />
                                            {errors.prn && (
                                                <p className="mt-1 text-sm text-destructive">{errors.prn}</p>
                                            )}
                                        </div>

                                        <div className="group">
                                            <label className="block text-sm font-medium text-foreground mb-1 group-focus-within:text-accent transition-colors">
                                                Stream
                                            </label>
                                            <select
                                                value={formData.stream}
                                                onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                                className="modern-select focus:ring-accent"
                                            >
                                                <option value="">Select your stream</option>
                                                {streams.map(stream => (
                                                    <option key={stream.value} value={stream.value}>
                                                        {stream.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.stream && (
                                                <p className="mt-1 text-sm text-destructive">{errors.stream}</p>
                                            )}
                                        </div>
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
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Why Register as a Student?</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Easy appointment booking with faculty members</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">View faculty office hours and availability</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Get instant confirmation for appointments</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-6 w-6 text-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">Track your appointment history and status</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Tips for Students</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li>• Book appointments in advance</li>
                                        <li>• Be specific about your meeting reason</li>
                                        <li>• Keep track of your appointment times</li>
                                        <li>• Cancel if you can't make it</li>
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