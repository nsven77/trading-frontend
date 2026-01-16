import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Pfade, die öffentlich sein dürfen (Login, Bilder, statische Dateien)
  const isPublicPath = path === '/auth/signin' || path === '/signin' || path.startsWith('/images/') || path.startsWith('/_next/');
  
  const token = request.cookies.get('token')?.value;

  // Wenn eingeloggt und auf Login-Seite -> Ab zum Dashboard
  if (isPublicPath && token && (path === '/auth/signin' || path === '/signin')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Wenn NICHT eingeloggt und auf geschützter Seite -> Ab zum Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
  }
    
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
