import "server-only";

import { apiFetch } from "./client";
import {
  AuthResponseSchema,
  type AuthResponseData,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/validators/auth";
import { UserSchema, UserListSchema, type UserData, type UserListData } from "@/lib/validators/user";
import { z } from "zod";

const IAM_URL =
  process.env["IAM_INTERNAL_URL"] ?? process.env["NEXT_PUBLIC_IAM_URL"] ?? "http://localhost:8081";

// --- Auth ---

export async function loginUser(data: LoginRequest): Promise<AuthResponseData> {
  return apiFetch(`${IAM_URL}/auth/login`, AuthResponseSchema, {
    method: "POST",
    body: data,
  });
}

export async function logoutUser(token: string): Promise<void> {
  await apiFetch(`${IAM_URL}/auth/logout`, z.unknown(), {
    method: "POST",
    token,
  });
}

export async function refreshToken(refreshToken: string): Promise<AuthResponseData> {
  return apiFetch(`${IAM_URL}/auth/refresh`, AuthResponseSchema, {
    method: "POST",
    body: { refreshToken },
  });
}

// --- Users ---

export async function registerParticipant(data: RegisterRequest): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/register`, UserSchema, {
    method: "POST",
    body: data,
  });
}

export async function getMe(token: string): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/me`, UserSchema, { token });
}

export async function getUserById(id: string, token: string): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/${id}`, UserSchema, { token });
}

export async function updateUser(
  id: string,
  data: unknown,
  token: string,
): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/${id}`, UserSchema, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deactivateUser(id: string, token: string): Promise<void> {
  await apiFetch(`${IAM_URL}/users/${id}/deactivate`, z.unknown(), {
    method: "PATCH",
    token,
  });
}

export async function activateUser(id: string, token: string): Promise<void> {
  await apiFetch(`${IAM_URL}/users/${id}/activate`, z.unknown(), {
    method: "PATCH",
    token,
  });
}

export async function listUsers(
  token: string,
  params: URLSearchParams,
): Promise<UserListData> {
  return apiFetch(`${IAM_URL}/users?${params.toString()}`, UserListSchema, { token });
}

export async function createSystemAdmin(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/system-admins`, UserSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function createCongressAdmin(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/congress-admins`, UserSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function createGuestSpeaker(data: unknown, token: string): Promise<UserData> {
  return apiFetch(`${IAM_URL}/users/guest-speakers`, UserSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function canBeCommitteeMember(
  id: string,
  token: string,
): Promise<{ canBeCommittee: boolean }> {
  return apiFetch(
    `${IAM_URL}/users/${id}/can-be-committee`,
    z.object({ canBeCommittee: z.boolean() }),
    { token },
  );
}
