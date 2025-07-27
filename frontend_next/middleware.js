// Filename should be middleware.js else Next.js will simply not recognize it as the global middleware file, and your route protection logic will not be executed.


import { NextResponse, NextRequest } from 'next/server';

// Define your protected and public routes
const PROTECTED_ROUTES = ['/dashboard', '/profile'];
const PUBLIC_ROUTES = ['/', '/signuplogin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Handle public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtectedRoute) {
    if (!token) {
      const redirectUrl = new URL('/signuplogin', request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|animes).*)',
  ],
};
