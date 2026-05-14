import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { Session } from "@/types/auth";

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe("useRole", () => {
  it("returns hasRole false for all roles when session is null", async () => {
    mockUseAuth.mockReturnValue({ session: null, isLoading: false, signOut: vi.fn() });

    const { useRole } = await import("@/hooks/useRole");
    const { result } = renderHook(() => useRole());

    expect(result.current.hasRole("PARTICIPANT")).toBe(false);
    expect(result.current.hasRole("SYSTEM_ADMIN")).toBe(false);
    expect(result.current.hasRole("CONGRESS_ADMIN")).toBe(false);
    expect(result.current.hasRole("GUEST_SPEAKER")).toBe(false);
  });

  it("returns true for the role included in session", async () => {
    const session: Session = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      email: "participant@example.com",
      fullName: "Maria Lopez",
      roles: ["PARTICIPANT"],
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    };

    mockUseAuth.mockReturnValue({ session, isLoading: false, signOut: vi.fn() });

    vi.resetModules();
    vi.mock("@/hooks/useAuth", () => ({
      useAuth: () => mockUseAuth(),
    }));
    vi.mock("next/navigation", () => ({
      useRouter: vi.fn(() => ({ push: vi.fn(), refresh: vi.fn() })),
    }));

    const { useRole } = await import("@/hooks/useRole");
    const { result } = renderHook(() => useRole());

    expect(result.current.hasRole("PARTICIPANT")).toBe(true);
    expect(result.current.hasRole("SYSTEM_ADMIN")).toBe(false);
  });

  it("handles multiple roles correctly", async () => {
    const session: Session = {
      userId: "550e8400-e29b-41d4-a716-446655440001",
      email: "admin@example.com",
      fullName: "Admin User",
      roles: ["SYSTEM_ADMIN", "CONGRESS_ADMIN"],
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    };

    mockUseAuth.mockReturnValue({ session, isLoading: false, signOut: vi.fn() });

    vi.resetModules();
    vi.mock("@/hooks/useAuth", () => ({
      useAuth: () => mockUseAuth(),
    }));
    vi.mock("next/navigation", () => ({
      useRouter: vi.fn(() => ({ push: vi.fn(), refresh: vi.fn() })),
    }));

    const { useRole } = await import("@/hooks/useRole");
    const { result } = renderHook(() => useRole());

    expect(result.current.hasRole("SYSTEM_ADMIN")).toBe(true);
    expect(result.current.hasRole("CONGRESS_ADMIN")).toBe(true);
    expect(result.current.hasRole("PARTICIPANT")).toBe(false);
  });
});
