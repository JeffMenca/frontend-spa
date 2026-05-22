import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { activeConference } from "@/lib/api/active-conference";
import {
  unauthorizedResponse,
  internalErrorResponse,
  forbiddenResponse,
} from "@/lib/api/responses";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const queryParams = new URL(request.url).searchParams;
    // TODO(conf-service): swap mock when conference GET /congresses/{id}/calls is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeConference.listCalls(id, queryParams));
  } catch {
    return internalErrorResponse();
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  if (!session.roles.includes("CONGRESS_ADMIN")) return forbiddenResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id } = await params;
  try {
    // TODO(conf-service): swap mock when conference POST /congresses/{id}/calls is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeConference.createCall(id, token), { status: 201 });
  } catch {
    return internalErrorResponse();
  }
}
