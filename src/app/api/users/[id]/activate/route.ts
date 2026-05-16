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

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (session === null) return unauthorizedResponse();
  const token = await getToken();
  if (token === null) return unauthorizedResponse();
  const { id } = await params;
  try {
    // TODO(backend-swap): iam PATCH /users/{id}/activate (port 8081)
    await activeIam.activateUser(id, token);
    return NextResponse.json({ message: "Usuario activado." }, { status: 200 });
  } catch {
    return internalErrorResponse();
  }
}
