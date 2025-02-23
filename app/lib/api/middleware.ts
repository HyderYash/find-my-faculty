import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export type ApiHandler = (req: NextRequest, context: any) => Promise<NextResponse>;

export const withErrorHandling = (handler: ApiHandler): ApiHandler => {
    return async (req: NextRequest, context: any) => {
        try {
            return await handler(req, context);
        } catch (error: any) {
            console.error('API Error:', error);
            return NextResponse.json(
                { error: error.message || 'Internal server error' },
                { status: error.status || 500 }
            );
        }
    };
};

export const withAuth = (handler: ApiHandler): ApiHandler => {
    return async (req: NextRequest, context: any) => {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return handler(req, context);
    };
};

export const withRole = (role: string, handler: ApiHandler): ApiHandler => {
    return async (req: NextRequest, context: any) => {
        const session = await getServerSession(authOptions);

        if (session?.user.role !== role) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        return handler(req, context);
    };
}; 