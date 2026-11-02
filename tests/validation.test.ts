import { describe, expect, it } from "vitest";
import { isValidEmail, validateBookingInput, validateDate } from "@/lib/validation";

const today = "2026-06-10";

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("sam@example.com")).toBe(true);
    expect(isValidEmail("  sam@example.ca ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("sam@")).toBe(false);
    expect(isValidEmail("not an email")).toBe(false);
  });
});

describe("validateDate", () => {
  it("rejects past dates and dates too far ahead", () => {
    expect(validateDate("2026-06-09", today)).toMatch(/past/);
    expect(validateDate("2026-09-30", today)).toMatch(/ahead/);
    expect(validateDate("2026-06-10", today)).toBeNull();
  });
});

describe("validateBookingInput", () => {
  it("reports missing fields", () => {
    const { input, errors } = validateBookingInput({ serviceId: "mens-cut", stylistId: "any" });
    expect(input).toBeUndefined();
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.startMin).toBeDefined();
  });
});
