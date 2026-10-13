import { kpis as demoKpis, type Alert, type Kpi } from "./demo-data";
import { analysed } from "./reviews";
import { MONTHS, categoryCounts, monthLabel, monthOnMonth, overallScore } from "./analytics";

// Starter recommendations (written by hand for now; Claude writes these in a later stage).
const SUGGESTIONS: Record<string, string> = {
  "Check-in": "Consider additional front-office coverage during the busiest arrival window, typically 3 PM to 5 PM.",
  "Front Desk": "Consider checking front desk coverage and phone handling at peak times.",
  Breakfast: "Consider opening an overflow seating area and refilling hot food more often at peak breakfast times.",
  "Wi-Fi": "Consider asking Maintenance to inspect access points in the rooms mentioned.",
  Housekeeping: "Consider reviewing the room-cleaning schedule for late finishes and missed requests.",
  Maintenance: "Consider a quick maintenance check of the facilities guests mention.",
  Noise: "Consider reviewing the noise-complaint escalation procedure with night staff.",
  Room: "Consider a room-quality inspection, focusing on beds and air conditioning.",
  Staff: "Consider a short team conversation about the feedback guests give.",
  Service: "Consider reviewing how guest requests are logged and followed up.",
  "Food & Beverage": "Consider reviewing restaurant and bar staffing and room-service times.",
  Parking: "Consider clearer parking directions at check-in.",
  "Check-out": "Consider reviewing check-out staffing on busy departure mornings.",
  Location: "Consider giving guests local recommendations at check-in.",
  Other: "Consider reviewing the feedback in more detail.",
};

const latest = MONTHS[MONTHS.length - 1];
const previous = MONTHS[MONTHS.length - 2];
const latestRows = analysed.filter((r) => r.month === latest);
const previousRows = analysed.filter((r) => r.month === previous);

export function buildAlerts(): Alert[] {
  const rank = { high: 0, medium: 1, low: 2 } as const;

  const alerts: Alert[] = categoryCounts(latestRows, "negative")
    .slice(0, 4)
    .map((item, i) => {
      const c = monthOnMonth(item.category);
      const severity: Alert["severity"] =
        c.change !== null && c.change >= 15 && c.last >= 10
          ? "high"
          : c.change !== null && c.change > 0
            ? "medium"
            : "low";
      const title =
        c.change === null
          ? `${item.category} complaints: ${c.last} in ${c.lastMonth}`
          : `${item.category} complaints ${c.change >= 0 ? "up" : "down"} ${Math.abs(c.change)}%`;
      return {
        id: `calc-${i}`,
        severity,
        title,
        detail: SUGGESTIONS[item.category] ?? "Consider reviewing the feedback in more detail.",
        why: `${c.last} reviews mentioned a ${item.category} problem in ${c.lastMonth}, compared with ${c.prev} in ${c.prevMonth} (${item.percent}% of ${c.lastMonth} reviews). Monthly counts are small, so treat this as a signal to investigate.`,
      };
    });

  return alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function buildKpis(): Kpi[] {
  const alerts = buildAlerts();
  const high = alerts.filter((a) => a.severity === "high").length;
  const score = overallScore(latestRows);
  const diff = score - overallScore(previousRows);

  return demoKpis.map((k) => {
    if (k.label === "Guest Sentiment") {
      return {
        ...k,
        value: `${score}/100`,
        note: `${diff >= 0 ? "+" : ""}${diff} pts vs ${monthLabel(previous)}`,
        tone: diff < 0 ? "warn" : "good",
      };
    }
    if (k.label === "Operational Alerts") {
      return {
        ...k,
        value: String(alerts.length),
        note: `${high} high priority`,
        tone: high > 0 ? "warn" : "good",
      };
    }
    return k;
  });
}
