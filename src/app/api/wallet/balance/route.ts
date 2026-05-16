import "server-only";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeWallet } from "@/lib/api/active-wallet";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    // TODO(backend-swap): wallet GET /wallet/balance (port 8083)
    return NextResponse.json(await activeWallet.getWalletBalance(token));
  } catch {
    return internalErrorResponse();
  }
}
