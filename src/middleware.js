import { NextResponse } from "next/server";

function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - 30_000;
}

function clearAuthAndRedirect(req, path = "/login") {
  const res = NextResponse.redirect(new URL(path, req.url));
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("currentuser", "", { path: "/", maxAge: 0 });
  return res;
}

function getRole(userCookie) {
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie)?.role || null;
  } catch {
    return null;
  }
}

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const userCookie = req.cookies.get("currentuser")?.value;
  const hasValidToken = Boolean(token && !isTokenExpired(token));

  const isAuthPage =
    pathname === "/" || pathname === "/login" || pathname.startsWith("/login/");

  // Valid token → dashboard (skip login)
  if (isAuthPage && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard/statistics", req.url));
  }

  // Protected routes: no / expired token → login
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/vendors");

  if (isProtected && !hasValidToken) {
    return clearAuthAndRedirect(req, "/login");
  }

  // Role gates (only when we have a user cookie)
  const role = getRole(userCookie);
  if (pathname.startsWith("/vendors") && role === "USER") {
    return NextResponse.redirect(new URL("/dashboard/statistics", req.url));
  }
  if (pathname.startsWith("/dashboard") && role === "VENDOR") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/login/:path*", "/vendors/:path*", "/dashboard/:path*"],
};
