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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  if (!session.roles.includes("CONGRESS_ADMIN")) return forbiddenResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id, userId } = await params;
  try {
    // TODO(conf-service): swap mock when conference DELETE /congresses/{id}/committee/{userId} is deployed - tracked in backlog Lane B
    await activeConference.removeCommitteeMember(id, userId, token);
    return new NextResponse(null, { status: 204 });
  } catch {
    return internalErrorResponse();
  }
}
