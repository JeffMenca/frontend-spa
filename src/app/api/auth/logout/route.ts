import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/api/iam";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token !== undefined && token !== "") {
      await logoutUser(token).catch(() => {
        // Ignore errors from IAM logout — clear cookies regardless
      });
    }
  } catch {
    // Ignore errors — always clear cookies
  }

  await clearAuthCookies();

  return NextResponse.json({ message: "Sesion cerrada exitosamente." }, { status: 200 });
}
