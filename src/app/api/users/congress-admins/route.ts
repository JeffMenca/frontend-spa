import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeIam } from "@/lib/api/active-iam";
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
    // TODO(conf-service): swap mock when iam POST /users/congress-admins is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeIam.createCongressAdmin(body, token), { status: 201 });
  } catch {
    return internalErrorResponse();
  }
}
