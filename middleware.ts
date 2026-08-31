import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = "Thai2026!";
const COOKIE_NAME = "thai_auth";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow login page, auth API, and static assets
  if (
    path.startsWith("/login") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/api/load") ||
    path.startsWith("/api/save") ||
    path.includes("favicon") ||
    path.includes(".png") ||
    path.includes(".jpg") ||
    path.includes(".svg") ||
    path.includes(".ico")
  ) {
    // Still allow API load/save only if authenticated? For simplicity allow them but they need cookie too
    // Actually protect everything except login page and auth
    if (path.startsWith("/login") || path.startsWith("/api/auth")) {
      return NextResponse.next();
    }
  }

  // Check auth cookie
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (cookie === PASSWORD) {
    return NextResponse.next();
  }

  // Not authenticated -> redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
};
