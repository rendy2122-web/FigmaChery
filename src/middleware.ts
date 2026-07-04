import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect dashboard routes - redirect to login if not authenticated
  if (pathname.startsWith("/dashboard")) {
    const hasSessionCookie = req.cookies.getAll().some(c => 
      c.name.includes("session-token")
    );
    
    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For login page - redirect to dashboard if already authenticated
  if (pathname.startsWith("/login")) {
    const hasSessionCookie = req.cookies.getAll().some(c => 
      c.name.includes("session-token")
    );
    
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
