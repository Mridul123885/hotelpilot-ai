import { describe, expect, it } from "vitest";
import { analysed } from "@/lib/reviews";
import { MONTHS, categoryCounts, monthOnMonth, overallScore } from "@/lib/analytics";

describe("review dataset", () => {
  it("contains 500 reviews over 6 months", () => {
    expect(analysed.length).toBe(500);
    expect(MONTHS.length).toBe(6);
  });

  it("gives every review at least one labelled mention", () => {
    expect(analysed.every((r) => r.mentions.length > 0)).toBe(true);
  });
});

describe("analytics", () => {
  const issues = categoryCounts(analysed, "negative");
  const countOf = (name: string) => issues.find((i) => i.category === name)?.count;

  it("counts complaint mentions per category", () => {
    expect(countOf("Check-in")).toBe(73);
    expect(countOf("Breakfast")).toBe(33);
    expect(countOf("Wi-Fi")).toBe(30);
  });

  it("sorts issues from most to least mentioned", () => {
    const counts = issues.map((i) => i.count);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("calculates month-on-month change for check-in complaints", () => {
    const c = monthOnMonth("Check-in");
    expect(c.prev).toBe(15);
    expect(c.last).toBe(18);
    expect(c.change).toBe(20);
  });

  it("keeps the overall score between 0 and 100", () => {
    const score = overallScore(analysed);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
