import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // PWA-Dateien müssen immer öffentlich zugänglich sein
    const publicPWAFiles = [
        '/manifest.json',
        '/sw.js',
        '/workbox-',
        '/icon-',
        '/offline.html'
    ];

    // Prüfe, ob die Anfrage eine PWA-Datei betrifft
    if (publicPWAFiles.some(file => pathname.startsWith(file))) {
        // Erlaube direkten Zugriff ohne Auth
        return NextResponse.next();
    }

    // Für alle anderen Anfragen: Standard-Verhalten
    return NextResponse.next();
}

// Konfiguriere, welche Pfade die Middleware betreffen soll
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
