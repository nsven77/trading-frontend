import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Diese Pfade sind öffentlich (mit Bindestrich!)
  const isPublicPath = 
    path === '/auth/sign-in' || 
    path === '/auth/sign-up';

  // Systemdateien und API ignorieren (damit Bilder/CSS nicht blockiert werden)
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api') || 
    path.startsWith('/static') ||
    path.startsWith('/images') ||
    path.includes('.') // Dateien wie .png, .css
  ) {
    return NextResponse.next();
  }

  // FALL 1: User hat KEIN Token und will auf geschützte Seite
  // -> Umleitung zu /auth/sign-in
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // FALL 2: User HAT Token und will auf Login-Seite
  // -> Umleitung zum Dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Catch-all Matcher
export const config = {
  matcher: '/:path*',
};
