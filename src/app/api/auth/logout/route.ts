import "server-only";

import { NextResponse } from "next/server";
import { activeIam } from "@/lib/api/active-iam";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token !== undefined && token !== "") {
      // TODO(backend-swap): iam POST /auth/logout (port 8081)
      await activeIam.logoutUser(token).catch(() => {
        // Ignore errors from IAM logout — clear cookies regardless
      });
    }
  } catch {
    // Ignore errors — always clear cookies
  }

  await clearAuthCookies();

  return NextResponse.json({ message: "Sesion cerrada exitosamente." }, { status: 200 });
}
