import { describe, expect, it } from "vitest";
import { formatDayChip, formatDuration, formatMoney, formatTime, formatTimeRange } from "@/lib/format";

describe("formatMoney", () => {
  it("formats cents as Canadian dollars", () => {
    expect(formatMoney(6500)).toBe("$65.00");
    expect(formatMoney(845)).toBe("$8.45");
  });
});

describe("formatTime", () => {
  it("uses a 12-hour clock", () => {
    expect(formatTime(9 * 60)).toBe("9:00 AM");
    expect(formatTime(12 * 60 + 30)).toBe("12:30 PM");
    expect(formatTime(17 * 60)).toBe("5:00 PM");
  });

  it("formats a range", () => {
    expect(formatTimeRange(600, 645)).toBe("10:00 AM - 10:45 AM");
  });
});

describe("formatDuration", () => {
  it("shows short services in minutes", () => {
    expect(formatDuration(30)).toBe("30 min");
    expect(formatDuration(45)).toBe("45 min");
  });

  it("shows whole hours without minutes", () => {
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(120)).toBe("2h");
  });
});

describe("formatDayChip", () => {
  it("labels a calendar date", () => {
    expect(formatDayChip("2026-03-02")).toEqual({ weekday: "Mon", day: "Mar 2" });
  });
});
