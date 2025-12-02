import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that are protected
    const isProtectedRoute = path.startsWith('/admin/dashboard');

    if (isProtectedRoute) {
        const cookie = request.cookies.get('session')?.value;
        const session = cookie ? await decrypt(cookie).catch(() => null) : null;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
