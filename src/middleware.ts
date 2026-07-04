import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware - only redirects from login to dashboard if already authenticated
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // For login page - redirect to dashboard if already authenticated
  if (pathname.startsWith("/login")) {
    // Check for any session cookie (NextAuth v5 uses different names)
    const hasSessionCookie = req.cookies.getAll().some(c => 
      c.name.includes("session-token")
    );
    
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Only run on login page - dashboard auth is handled by layout.tsx
export const config = {
  matcher: ["/login"],
};