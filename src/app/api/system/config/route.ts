import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeWallet } from "@/lib/api/active-wallet";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";
import { z } from "zod";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

const UpdateConfigSchema = z.object({
  commissionPercent: z.number().min(0).max(100),
});

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    // TODO(backend-swap): wallet GET /system/config (port 8083)
    return NextResponse.json(await activeWallet.getSystemConfig(token));
  } catch {
    return internalErrorResponse();
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    const body: unknown = await request.json();
    const parsed = UpdateConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: "validation.failed", status: 400, title: "Validation Failed", detail: parsed.error.message },
        { status: 400 },
      );
    }
    // TODO(backend-swap): wallet PUT /system/config (port 8083)
    return NextResponse.json(
      await activeWallet.updateSystemConfig(parsed.data.commissionPercent, token),
    );
  } catch {
    return internalErrorResponse();
  }
}
