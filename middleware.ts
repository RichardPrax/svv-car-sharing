import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // PWA-Dateien und API-Routen müssen immer öffentlich zugänglich sein
    const publicPaths = [
        '/manifest.json',
        '/api/manifest',
        '/sw.js',
        '/workbox-',
        '/icon-',
        '/offline.html'
    ];

    // Prüfe, ob die Anfrage eine öffentliche Datei/Route betrifft
    if (publicPaths.some(path => pathname.startsWith(path))) {
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
         * - api (API routes - werden separat behandelt)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
