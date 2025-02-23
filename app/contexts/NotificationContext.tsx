'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification from '../components/ui/Notification';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationData {
    id: number;
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let notificationId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const showNotification = useCallback((type: NotificationType, message: string) => {
        const id = ++notificationId;
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, 5000);
    }, []);

    const handleClose = useCallback((id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        type={notification.type}
                        message={notification.message}
                        onClose={() => handleClose(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
} 