import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/leads',
  '/followups', 
  '/expenses',
  '/calendar',
  '/change-password'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
];

// Simple JWT decoder for middleware (server-side)
function decodeJWTPayload(token: string): { exp?: number } | null {
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    const parts = cleanToken.split('.');
    
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decodedPayload = Buffer.from(
      payload.replace(/-/g, '+').replace(/_/g, '/'), 
      'base64'
    ).toString();
    
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user data from cookies (assuming it's stored there by Zustand persist)
  const userStoreCookie = request.cookies.get('userStore');
  let user = null;
  let token = null;

  if (userStoreCookie) {
    try {
      const userStoreData = JSON.parse(userStoreCookie.value);
      user = userStoreData.state?.user;
      token = user?.token;
    } catch (error) {
      console.error('Error parsing user store cookie:', error);
    }
  }

  const isAuthenticated = user && token && !isTokenExpired(token);

  // Handle root route
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
