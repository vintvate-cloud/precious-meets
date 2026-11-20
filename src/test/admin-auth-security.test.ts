import { describe, expect, it } from "vitest";
import { verifyAdminPassword } from "@/lib/auth-context";

describe("Admin Authentication Security Verification", () => {
  it("strictly denies access with legacy hardcoded password 11111111", () => {
    expect(verifyAdminPassword("11111111")).toBe(false);
  });

  it("strictly denies access with any random 8+ character string", () => {
    expect(verifyAdminPassword("password123")).toBe(false);
    expect(verifyAdminPassword("12345678")).toBe(false);
    expect(verifyAdminPassword("administrator")).toBe(false);
    expect(verifyAdminPassword("anyrandomsecretpass")).toBe(false);
  });

  it("strictly denies access with empty or non-string inputs", () => {
    expect(verifyAdminPassword("")).toBe(false);
    expect(verifyAdminPassword("   ")).toBe(false);
    expect(verifyAdminPassword(null as any)).toBe(false);
    expect(verifyAdminPassword(undefined as any)).toBe(false);
  });

  it("authenticates only with the configured admin password", () => {
    expect(verifyAdminPassword("PreciousAdmin2026!")).toBe(true);
    expect(verifyAdminPassword("  PreciousAdmin2026!  ")).toBe(true);
  });
});

