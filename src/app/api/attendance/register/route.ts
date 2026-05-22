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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  if (!session.roles.includes("CONGRESS_ADMIN")) return forbiddenResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  try {
    const body: unknown = await request.json();
    // TODO(conf-service): swap mock when conference POST /attendance/register is deployed - tracked in backlog Lane B
    return NextResponse.json(await activeConference.registerAttendance(body, token), {
      status: 201,
    });
  } catch {
    return internalErrorResponse();
  }
}
