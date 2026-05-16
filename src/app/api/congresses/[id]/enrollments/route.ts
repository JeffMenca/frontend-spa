import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeConference } from "@/lib/api/active-conference";
import { unauthorizedResponse, internalErrorResponse } from "@/lib/api/responses";
import { randomUUID } from "crypto";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id } = await params;
  try {
    // TODO(backend-swap): conference GET /congresses/{id}/enrollments (port 8082)
    return NextResponse.json(await activeConference.getCongressEnrollments(id, token));
  } catch {
    return internalErrorResponse();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body: unknown = await request.json();
    // GAP-10: BFF generates the idempotency key
    const idempotencyKey = randomUUID();
    // TODO(backend-swap): conference POST /congresses/{id}/enrollments (port 8082)
    return NextResponse.json(
      await activeConference.enrollInCongress(id, body, token, idempotencyKey),
      { status: 201 },
    );
  } catch {
    return internalErrorResponse();
  }
}
