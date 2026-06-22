import { NextResponse } from "next/server";

/* ---------------------------------------------------------------------------
 * Maintenance mode (Next.js 16 "proxy" convention, formerly middleware).
 * - MAINTENANCE_MODE=true  → whole site shows the Under Construction page.
 * - MAINTENANCE_PATHS=/quote,/careers → take only those routes offline.
 * Static assets, Next internals and API routes are always allowed through so
 * the maintenance page still renders (and health checks keep working).
 * ------------------------------------------------------------------------- */

const ALWAYS_ALLOW = ["/maintenance", "/_next", "/images", "/api", "/favicon.ico"];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (ALWAYS_ALLOW.some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const wholeSite = process.env.MAINTENANCE_MODE === "true";
  const paths = (process.env.MAINTENANCE_PATHS || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const pathOffline = paths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (wholeSite || pathOffline) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    // 503 tells search engines this is temporary (no SEO penalty).
    return NextResponse.rewrite(url, { status: 503 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals / static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
