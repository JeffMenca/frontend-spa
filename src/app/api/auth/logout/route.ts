import "server-only";

import { NextResponse } from "next/server";
import { activeIam } from "@/lib/api/active-iam";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (accessToken !== undefined && refreshToken !== undefined) {
      // IAM needs both: access token in Authorization header, refresh token in body.
      await activeIam.logoutUser(accessToken, refreshToken).catch(() => {
        // Ignore upstream errors — always clear local cookies.
      });
    }
  } catch {
    // Ignore errors — always clear cookies.
  }

  await clearAuthCookies();

  return NextResponse.json({ message: "Sesion cerrada exitosamente." }, { status: 200 });
}
