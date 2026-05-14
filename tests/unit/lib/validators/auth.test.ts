import { describe, it, expect } from "vitest";
import { LoginRequestSchema, AuthResponseSchema, RegisterRequestSchema } from "@/lib/validators/auth";

describe("LoginRequestSchema", () => {
  it("validates a valid login request", () => {
    const result = LoginRequestSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = LoginRequestSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = LoginRequestSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = LoginRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("AuthResponseSchema", () => {
  it("parses a valid auth response", () => {
    const result = AuthResponseSchema.safeParse({
      accessToken: "eyJhbGciOiJSUzI1NiJ9.test.token",
      refreshToken: "eyJhbGciOiJSUzI1NiJ9.refresh.token",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accessToken).toBe("eyJhbGciOiJSUzI1NiJ9.test.token");
    }
  });

  it("rejects a response missing tokens", () => {
    const result = AuthResponseSchema.safeParse({ accessToken: "token" });
    expect(result.success).toBe(false);
  });

  it("rejects empty token strings", () => {
    const result = AuthResponseSchema.safeParse({
      accessToken: "",
      refreshToken: "refresh",
    });
    expect(result.success).toBe(false);
  });
});

describe("RegisterRequestSchema", () => {
  it("validates a valid registration request", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      fullName: "Juan Perez",
      organization: "USAC",
      phone: "55551234",
      personalId: "ABC123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects personalId with special characters", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      fullName: "Juan Perez",
      organization: "USAC",
      phone: "55551234",
      personalId: "ABC-123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = RegisterRequestSchema.safeParse({
      email: "user@example.com",
      password: "short",
      fullName: "Juan Perez",
      organization: "USAC",
      phone: "55551234",
      personalId: "ABC123",
    });
    expect(result.success).toBe(false);
  });
});
