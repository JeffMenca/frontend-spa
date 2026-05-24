import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { activeIam } from "@/lib/api/active-iam";
import { activeWallet } from "@/lib/api/active-wallet";
import { setAuthCookies } from "@/lib/auth/cookies";
import { RegisterRequestSchema } from "@/lib/validators/auth";
import { ApplicationError } from "@/types/error";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = RegisterRequestSchema.safeParse(body);

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

    // IAM returns tokens + user profile on registration.
    const authResponse = await activeIam.registerParticipant(parsed.data);

    // GAP-02: create wallet after registration (idempotent, best-effort).
    // Pass the access token so the wallet service can authenticate the call.
    // If this fails, the BFF must retry on the user's first login.
    activeWallet.createWallet(authResponse.user.id, authResponse.accessToken).catch(() => {
      // Wallet creation failed silently; BFF retries on first login (GAP-02).
    });

    // Log the user in immediately after successful registration.
    await setAuthCookies(authResponse.accessToken, authResponse.refreshToken);

    return NextResponse.json(authResponse.user, { status: 201 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { code: error.code, status: error.status, title: "Error", detail: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        code: "system.internal_error",
        status: 500,
        title: "Internal Server Error",
        detail: "Unexpected error.",
      },
      { status: 500 },
    );
  }
}
