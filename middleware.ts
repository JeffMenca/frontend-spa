import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Minimal schemas needed in edge middleware — defined inline to avoid chain dependencies.
const JwtPayloadSchema = z.object({ exp: z.number() }).passthrough();
const RefreshTokenResponseSchema = z
  .object({ accessToken: z.string().min(1), refreshToken: z.string().min(1) })
  .passthrough();

const PROTECTED_ROUTE_PREFIXES = ["/participant", "/congress-admin", "/system-admin"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getTokenExpiry(token: string): number {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return 0;
    const payloadPart = parts[1];
    if (payloadPart === undefined) return 0;

    const payloadJson = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JwtPayloadSchema.safeParse(JSON.parse(payloadJson));
    return parsed.success ? parsed.data.exp : 0;
  } catch {
    return 0;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Check if access token is valid and not expiring within 60s
  if (accessToken !== undefined && accessToken !== "") {
    const exp = getTokenExpiry(accessToken);
    const now = Math.floor(Date.now() / 1000);

    if (exp > now + 60) {
      // Token is valid and not about to expire
      return NextResponse.next();
    }
  }

  // Attempt token refresh if refresh token is available
  if (refreshToken !== undefined && refreshToken !== "") {
    try {
      const iamUrl = process.env["NEXT_PUBLIC_IAM_URL"] ?? "http://localhost:8081";

      const refreshResponse = await fetch(`${iamUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const parsed = RefreshTokenResponseSchema.safeParse(await refreshResponse.json());

        if (parsed.success) {
          const response = NextResponse.next();
          response.cookies.set("access_token", parsed.data.accessToken, {
            httpOnly: true,
            secure: process.env["NODE_ENV"] === "production",
            sameSite: "lax",
            maxAge: 900,
            path: "/",
          });
          response.cookies.set("refresh_token", parsed.data.refreshToken, {
            httpOnly: true,
            secure: process.env["NODE_ENV"] === "production",
            sameSite: "lax",
            maxAge: 604800,
            path: "/",
          });
          return response;
        }
      }
    } catch {
      // Refresh failed; fall through to redirect
    }

    // Refresh failed — clear cookies and redirect
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  // No tokens available
  if (isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|api/auth/login|api/auth/refresh).*)",
};
