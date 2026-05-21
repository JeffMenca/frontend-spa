import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeWallet } from "@/lib/api/active-wallet";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";
import { ApplicationError } from "@/types/error";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    const params = new URL(request.url).searchParams;
    return NextResponse.json(await activeWallet.getWalletTransactions(token, params));
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { code: error.code, status: error.status, title: "Error", detail: error.message },
        { status: error.status },
      );
    }
    return internalErrorResponse();
  }
}
