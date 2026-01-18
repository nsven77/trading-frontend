import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Wir lesen das Token aus dem Cookie
  const token = request.cookies.get('token')?.value;

  // Diese Pfade sind öffentlich (Login, Registrierung, Bilder)
  const isPublicPath = 
    path === '/auth/signin' || 
    path === '/auth/signup' ||
    path === '/verify-email'; 

  // FALL 1: User ist NICHT eingeloggt (kein Token)
  // ... und versucht auf eine geschützte Seite (z.B. Dashboard) zu kommen.
  // Wir schließen Bilder/CSS explizit aus, damit das Layout nicht kaputt geht.
  if (!token && !isPublicPath) {
    // -> Wir leiten ihn zur Login-Seite
    return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
  }

  // FALL 2: User IST eingeloggt (hat Token)
  // ... und versucht die Login-Seite aufzurufen.
  if (token && isPublicPath) {
    // -> Braucht er nicht mehr, wir schicken ihn zum Dashboard
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Sonst: Alles okay, lass den Request durch
  return NextResponse.next();
}

// Der Matcher sagt Next.js, welche Pfade überhaupt geprüft werden sollen.
// Wir ignorieren API, interne Next.js Dateien und Bilder im public Ordner.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
