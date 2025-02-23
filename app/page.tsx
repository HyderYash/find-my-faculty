'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CustomLoader from './components/ui/CustomLoader';
import AnimatedCounter from './components/ui/AnimatedCounter';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const statsTimer = setTimeout(() => {
      setShowStats(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
    };
  }, []);

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/60">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                New Feature
              </span>
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Find My Faculty
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Schedule appointments with your faculty members easily and efficiently.
              Get instant access to office hours and manage your meetings in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="modern-button-primary px-8 py-3 text-base"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="modern-button-secondary px-8 py-3 text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Active Users */}
            <div
              className={`glass-card p-8 text-center transform transition-all duration-500 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="text-4xl font-bold text-primary mb-3">
                {showStats && <AnimatedCounter end={1000} suffix="+" />}
              </div>
              <p className="text-lg text-muted-foreground">Active Users</p>
            </div>

            {/* Faculty Members */}
            <div
              className={`glass-card p-8 text-center transform transition-all duration-500 delay-100 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="text-4xl font-bold text-accent mb-3">
                {showStats && <AnimatedCounter end={100} suffix="+" />}
              </div>
              <p className="text-lg text-muted-foreground">Faculty Members</p>
            </div>

            {/* Daily Appointments */}
            <div
              className={`glass-card p-8 text-center transform transition-all duration-500 delay-200 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="text-4xl font-bold text-primary mb-3">
                {showStats && <AnimatedCounter end={500} suffix="+" />}
              </div>
              <p className="text-lg text-muted-foreground">Daily Appointments</p>
            </div>

            {/* Success Rate */}
            <div
              className={`glass-card p-8 text-center transform transition-all duration-500 delay-300 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="text-4xl font-bold text-accent mb-3">
                {showStats && <AnimatedCounter end={99} suffix="%" />}
              </div>
              <p className="text-lg text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
              Features
            </span>
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose Find My Faculty?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Experience a seamless appointment scheduling system designed for modern education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Easy Scheduling</h3>
              <p className="text-muted-foreground">Book appointments with faculty members in just a few clicks. View available time slots and schedule meetings instantly.</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Notifications</h3>
              <p className="text-muted-foreground">Get instant notifications for appointment confirmations, reminders, and updates. Stay informed about your meetings.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Office Hours Management</h3>
              <p className="text-muted-foreground">Faculty members can easily manage their office hours and availability. Students can view and book available slots.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
              How It Works
            </span>
            <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
              Simple Process, Better Results
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Get started with Find My Faculty in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Account</h3>
              <p className="text-muted-foreground">Sign up as a student or faculty member and complete your profile.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Set Availability</h3>
              <p className="text-muted-foreground">Faculty members set their office hours, students can view available slots.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Book Appointments</h3>
              <p className="text-muted-foreground">Schedule meetings and receive instant confirmations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students and faculty members who are already using Find My Faculty to streamline their appointment scheduling.
            </p>
            <Link
              href="/auth/register"
              className="modern-button-primary px-8 py-3 text-base"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
