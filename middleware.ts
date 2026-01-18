import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Wir lesen das Token aus
  const token = request.cookies.get('token')?.value;

  console.log(`[Middleware] Pfad: ${path} | Token gefunden: ${token ? 'JA' : 'NEIN'}`);

  const isPublicPath = 
    path === '/auth/signin' || 
    path === '/auth/signup' ||
    path.startsWith('/images') || 
    path.startsWith('/_next') ||
    path === '/favicon.ico';

  // Wenn man eingeloggt ist und zum Login will -> Dashboard
  if (token && (path === '/auth/signin' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // WICHTIG: Wir leiten NICHT mehr automatisch um, wenn Token fehlt.
  // Wir lassen dich erstmal durch, damit du sehen kannst, ob die Seiten existieren.
  // Später aktivieren wir den Schutz wieder.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
