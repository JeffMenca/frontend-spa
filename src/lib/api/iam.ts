import "server-only";

import { z } from "zod";
import { apiFetch, apiResponseOf } from "./client";
import {
  IamAuthResponseSchema,
  RefreshResponseSchema,
  type IamAuthResponseData,
  type RefreshResponseData,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/validators/auth";
import { UserSchema, UserListSchema, type UserData, type UserListData } from "@/lib/validators/user";

// All traffic goes through the API Gateway at :8080, which load-balances to lb://iam-service.
// The gateway strips nothing — paths passed here must include the /api/v1 prefix.
const GATEWAY = process.env["GATEWAY_URL"] ?? "http://localhost:8080";
const BASE = `${GATEWAY}/api/v1`;

// --- Auth ---

export async function loginUser(data: LoginRequest): Promise<IamAuthResponseData> {
  return apiFetch(`${BASE}/auth/login`, apiResponseOf(IamAuthResponseSchema), {
    method: "POST",
    body: data,
  });
}

// IAM requires the refresh token in the request body to invalidate it on the server.
export async function logoutUser(accessToken: string, refreshToken: string): Promise<void> {
  await apiFetch(`${BASE}/auth/logout`, apiResponseOf(z.unknown()), {
    method: "POST",
    token: accessToken,
    body: { refreshToken },
  });
}

export async function refreshToken(token: string): Promise<RefreshResponseData> {
  return apiFetch(`${BASE}/auth/refresh`, apiResponseOf(RefreshResponseSchema), {
    method: "POST",
    body: { refreshToken: token },
  });
}

// --- Users ---

export async function registerParticipant(data: RegisterRequest): Promise<IamAuthResponseData> {
  return apiFetch(`${BASE}/users/register`, apiResponseOf(IamAuthResponseSchema), {
    method: "POST",
    body: data,
  });
}

export async function getMe(token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/me`, apiResponseOf(UserSchema), { token });
}

export async function getUserById(id: string, token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/${id}`, apiResponseOf(UserSchema), { token });
}

export async function updateUser(id: string, data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/${id}`, apiResponseOf(UserSchema), {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deactivateUser(id: string, token: string): Promise<void> {
  await apiFetch(`${BASE}/users/${id}/deactivate`, apiResponseOf(z.unknown()), {
    method: "PATCH",
    token,
  });
}

export async function activateUser(id: string, token: string): Promise<void> {
  await apiFetch(`${BASE}/users/${id}/activate`, apiResponseOf(z.unknown()), {
    method: "PATCH",
    token,
  });
}

export async function listUsers(token: string, params: URLSearchParams): Promise<UserListData> {
  return apiFetch(`${BASE}/users?${params.toString()}`, apiResponseOf(UserListSchema), { token });
}

export async function createSystemAdmin(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/system-admins`, apiResponseOf(UserSchema), {
    method: "POST",
    body: data,
    token,
  });
}

export async function createCongressAdmin(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/congress-admins`, apiResponseOf(UserSchema), {
    method: "POST",
    body: data,
    token,
  });
}

export async function createGuestSpeaker(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${BASE}/users/guest-speakers`, apiResponseOf(UserSchema), {
    method: "POST",
    body: data,
    token,
  });
}

// IAM returns { eligible: boolean }; we map to the name used across the frontend.
export async function canBeCommitteeMember(
  id: string,
  token: string,
): Promise<{ canBeCommittee: boolean }> {
  // The transform changes the input shape — cast keeps strict tsconfig happy.
  const schema = z
    .object({ eligible: z.boolean() })
    .transform((r) => ({ canBeCommittee: r.eligible })) as unknown as z.ZodSchema<{
    canBeCommittee: boolean;
  }>;
  return apiFetch(`${BASE}/users/${id}/can-be-committee`, apiResponseOf(schema), { token });
}
