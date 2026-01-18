import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Zuerst alles ignorieren, was keine "echte" Seite ist
  // Das verhindert Probleme mit Bildern, CSS, API, etc.
  if (
    path.startsWith('/_next') || // Next.js Systemdateien
    path.startsWith('/api') ||   // API Routen
    path.startsWith('/static') || // Statische Dateien
    path.includes('.') // Dateien mit Endung (z.B. bild.png, style.css)
  ) {
    return NextResponse.next();
  }

  // 2. Token prüfen
  const token = request.cookies.get('token')?.value;
  const isPublicPage = path === '/auth/signin' || path === '/auth/signup';

  // LOGS (Damit du im Server-Log siehst was passiert)
  console.log(`Middleware check: Path=${path}, Token=${!!token}`);

  // 3. Logik:
  
  // Wenn eingeloggt und auf Login-Seite -> Ab zum Dashboard
  if (token && isPublicPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Wenn NICHT eingeloggt und auf geschützter Seite -> Ab zum Login
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Sonst alles erlauben
  return NextResponse.next();
}

// Wir lassen den Matcher komplett weg (oder nutzen einen "Catch-All"), 
// damit die Logik oben (Punkt 1) entscheidet. Das ist weniger fehleranfällig.
export const config = {
  matcher: '/:path*', 
};
