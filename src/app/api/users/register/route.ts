import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { activeIam } from "@/lib/api/active-iam";
import { activeWallet } from "@/lib/api/active-wallet";
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

    // TODO(backend-swap): iam POST /users/register (port 8081)
    const user = await activeIam.registerParticipant(parsed.data);

    // GAP-02: create wallet after registration (idempotent, best-effort)
    // TODO(backend-swap): wallet POST /wallets (port 8083)
    activeWallet.createWallet(user.id).catch(() => {
      // Wallet creation failed — retry on next login
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { code: error.code, status: error.status, title: "Error", detail: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { code: "system.internal_error", status: 500, title: "Internal Server Error", detail: "Unexpected error." },
      { status: 500 },
    );
  }
}
