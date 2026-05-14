import "server-only";

import type { ZodSchema } from "zod";
import { ApplicationError } from "@/types/error";
import { ProblemDetailSchema } from "@/lib/validators/error";

interface ApiFetchOptions {
  token?: string;
  idempotencyKey?: string;
  method?: string;
  body?: unknown;
}

function buildHeaders(options: ApiFetchOptions): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.token !== undefined && options.token !== "") {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  if (options.idempotencyKey !== undefined && options.idempotencyKey !== "") {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  return headers;
}

async function throwOnError(response: Response): Promise<void> {
  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => ({}));
    const parsed = ProblemDetailSchema.safeParse(errorBody);

    if (parsed.success) {
      throw new ApplicationError(parsed.data.code, parsed.data.status, parsed.data.detail);
    }

    throw new ApplicationError(
      "system.internal_error",
      response.status,
      `HTTP ${response.status}: ${response.statusText}`,
    );
  }
}

// Typed JSON fetch. Parses response with the provided zod schema.
// On 4xx/5xx: parses RFC 7807 and throws ApplicationError.
// On schema mismatch: throws ApplicationError with code "system.internal_error".
export async function apiFetch<T>(
  url: string,
  schema: ZodSchema<T>,
  options: ApiFetchOptions = {},
): Promise<T> {
  const fetchInit: RequestInit = {
    method: options.method ?? "GET",
    headers: buildHeaders(options),
  };

  if (options.body !== undefined) {
    fetchInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchInit);
  await throwOnError(response);

  const responseBody: unknown = await response.json();
  const result = schema.safeParse(responseBody);

  if (!result.success) {
    throw new ApplicationError(
      "system.internal_error",
      500,
      `Contract violation: API response did not match expected schema. ${result.error.message}`,
    );
  }

  return result.data;
}

// Binary fetch for endpoints that return non-JSON content (e.g. PDF diploma download).
// Returns the raw Response body as an ArrayBuffer.
// On 4xx/5xx: parses RFC 7807 and throws ApplicationError.
export async function apiFetchBinary(
  url: string,
  options: Omit<ApiFetchOptions, "body"> = {},
): Promise<ArrayBuffer> {
  const headers = buildHeaders(options);
  headers["Accept"] = "*/*";

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  await throwOnError(response);
  return response.arrayBuffer();
}
