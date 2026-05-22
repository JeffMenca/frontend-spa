import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { activeIam } from "@/lib/api/active-iam";
import { setAuthCookies } from "@/lib/auth/cookies";
import { LoginRequestSchema } from "@/lib/validators/auth";
import { ApplicationError } from "@/types/error";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = LoginRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "validation.failed",
          status: 400,
          title: "Validation Failed",
          detail: parsed.error.message,
        },
        { status: 400 },
      );
    }

    // IAM returns tokens + user profile in one response — no extra getMe() call needed.
    const authResponse = await activeIam.loginUser(parsed.data);
    await setAuthCookies(authResponse.accessToken, authResponse.refreshToken);

    return NextResponse.json(authResponse.user, { status: 200 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        {
          code: error.code,
          status: error.status,
          title: "Error",
          detail: error.message,
        },
        { status: error.status },
      );
    }

    const isNetworkError =
      error instanceof TypeError &&
      (error.message.includes("fetch") || error.message.includes("connect"));
    console.error("[login] Unexpected error:", error);
    return NextResponse.json(
      {
        code: "system.internal_error",
        status: 500,
        title: "Internal Server Error",
        detail: isNetworkError
          ? "No se puede conectar al servidor. Verifica que los servicios backend esten corriendo."
          : "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
