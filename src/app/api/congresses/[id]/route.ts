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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  try {
    // TODO(conf-service): swap mock when conference GET /congresses/{id} is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeConference.getCongress(id));
  } catch {
    return internalErrorResponse();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  if (!session.roles.includes("CONGRESS_ADMIN")) return forbiddenResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body: unknown = await request.json();
    // TODO(conf-service): swap mock when conference PUT /congresses/{id} is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeConference.updateCongress(id, body, token));
  } catch {
    return internalErrorResponse();
  }
}

export async function DELETE(
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
    // TODO(conf-service): swap mock when conference DELETE /congresses/{id} is deployed - tracked in backlog Lane B
    await activeConference.deleteCongress(id, token);
    return new NextResponse(null, { status: 204 });
  } catch {
    return internalErrorResponse();
  }
}
