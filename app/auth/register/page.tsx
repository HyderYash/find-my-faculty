import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/60 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo/Icon */}
                <div className="w-20 h-20 mx-auto bg-accent/10 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>

                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                    Choose your role
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Select how you want to use Find My Faculty
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="glass-card p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Teacher Registration Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <a
                                href="/auth/register/teacher"
                                className="relative block h-full p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-border/50"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                Register as Teacher
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-base text-muted-foreground flex-grow">
                                        Create an account to manage your office hours and appointments. Set your availability, accept or decline appointment requests, and maintain an organized schedule.
                                    </p>
                                    <div className="mt-6 flex justify-end items-center space-x-2 text-primary group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium">Get Started</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Student Registration Card */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-primary/50 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <a
                                href="/auth/register/student"
                                className="relative block h-full p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-border/50"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                                                Register as Student
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-base text-muted-foreground flex-grow">
                                        Create an account to book appointments with faculty members. View available time slots, schedule meetings, and receive instant confirmations for your appointments.
                                    </p>
                                    <div className="mt-6 flex justify-end items-center space-x-2 text-accent group-hover:translate-x-1 transition-transform">
                                        <span className="text-sm font-medium">Get Started</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-10 text-center border-t border-border/50 pt-8">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <a
                                href="/auth/signin"
                                className="font-medium text-accent hover:text-accent/80 transition-colors"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                        By registering, you agree to our{' '}
                        <a href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                            Privacy Policy
                        </a>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Protected by reCAPTCHA and subject to Google's{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
                            Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 transition-colors">
                            Terms of Service
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 