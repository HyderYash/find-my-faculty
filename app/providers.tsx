'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/layout/MainLayout';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                <NotificationProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </NotificationProvider>
            </SessionProvider>
        </ThemeProvider>
    );
} 