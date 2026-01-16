import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Diese Pfade sind IMMER erlaubt (Login, Bilder, CSS, JS)
  // Wir fügen auch favicon.ico und _next hinzu, damit nichts kaputt geht
  const isPublicPath = 
    path === '/auth/signin' || 
    path === '/auth/signup' ||
    path.startsWith('/images') || 
    path.startsWith('/_next') ||
    path === '/favicon.ico';

  // 1. Wenn User eingeloggt ist und Login aufruft -> Dashboard
  if (token && (path === '/auth/signin' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // 2. Wenn User NICHT eingeloggt ist und eine geschützte Seite aufruft -> Login
  // Wir prüfen: Ist es KEIN öffentlicher Pfad? Und fehlt das Token?
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
  }

  // Ansonsten: Lass den Request durch
  return NextResponse.next();
}

// Der Matcher sorgt dafür, dass die Middleware überhaupt ausgeführt wird
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
