import { analysed, type Analysed, type Sentiment } from "./reviews";

const NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const monthLabel = (m: string) => NAMES[Number(m.slice(5, 7)) - 1];

export const MONTHS = Array.from(new Set(analysed.map((r) => r.month))).sort();

// Overall sentiment: average star rating converted to a 0-100 score.
export function overallScore(rows: Analysed[]) {
  const avg = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;
  return Math.round((avg / 5) * 100);
}

// How many reviews mention each category (counted once per review).
export function categoryCounts(rows: Analysed[], sentiment: Sentiment) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const cats = new Set(
      r.mentions.filter((m) => m.sentiment === sentiment).map((m) => m.category)
    );
    for (const c of cats) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({
      category,
      count,
      percent: Math.round((count / rows.length) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

// Number of reviews per month that mention a category.
export function monthlyCounts(category: string, sentiment: Sentiment) {
  return MONTHS.map((m) => ({
    month: monthLabel(m),
    count: analysed.filter(
      (r) =>
        r.month === m &&
        r.mentions.some((x) => x.category === category && x.sentiment === sentiment)
    ).length,
  }));
}

// Latest month compared with the month before it.
export function monthOnMonth(category: string) {
  const series = monthlyCounts(category, "negative");
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  const change =
    prev.count === 0 ? null : Math.round(((last.count - prev.count) / prev.count) * 100);
  return {
    category,
    lastMonth: last.month,
    prevMonth: prev.month,
    last: last.count,
    prev: prev.count,
    change,
  };
}

// Data shaped for the trend chart: one row per month, one column per category.
export function trendData(categories: string[]) {
  return MONTHS.map((m) => {
    const row: Record<string, string | number> = { month: monthLabel(m) };
    for (const c of categories) {
      row[c] = analysed.filter(
        (r) =>
          r.month === m &&
          r.mentions.some((x) => x.category === c && x.sentiment === "negative")
      ).length;
    }
    return row;
  });
}
