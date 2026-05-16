import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeConference } from "@/lib/api/active-conference";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const params = new URL(request.url).searchParams;
    // TODO(backend-swap): conference GET /congresses (port 8082)
    return NextResponse.json(await activeConference.listCongresses(params));
  } catch {
    return internalErrorResponse();
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    const body: unknown = await request.json();
    // TODO(backend-swap): conference POST /congresses (port 8082)
    return NextResponse.json(await activeConference.createCongress(body, token), { status: 201 });
  } catch {
    return internalErrorResponse();
  }
}
