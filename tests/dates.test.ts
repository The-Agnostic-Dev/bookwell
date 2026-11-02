import { describe, expect, it } from "vitest";
import { addDays, daysBetween, isISODate, weekdayOf } from "@/lib/dates";

describe("dates", () => {
  it("adds days across month and year ends", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("validates ISO dates", () => {
    expect(isISODate("2026-02-28")).toBe(true);
    expect(isISODate("2026-02-30")).toBe(false);
    expect(isISODate("28/02/2026")).toBe(false);
  });

  it("knows the weekday", () => {
    expect(weekdayOf("2026-11-02")).toBe(1);
    expect(weekdayOf("2026-11-08")).toBe(0);
  });

  it("counts days between dates", () => {
    expect(daysBetween("2026-10-30", "2026-11-02")).toBe(3);
  });
});
