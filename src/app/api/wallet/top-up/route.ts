import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeWallet } from "@/lib/api/active-wallet";
import { TopUpSchema } from "@/lib/validators/wallet";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    const body: unknown = await request.json();
    const parsed = TopUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: "validation.failed", status: 400, title: "Validation Failed", detail: parsed.error.message },
        { status: 400 },
      );
    }
    // TODO(backend-swap): wallet POST /wallet/top-up (port 8083)
    return NextResponse.json(await activeWallet.topUpWallet(parsed.data, token), { status: 200 });
  } catch {
    return internalErrorResponse();
  }
}
