// Synthetic demonstration data. Not real hotel data.

export type Kpi = {
  label: string;
  value: string;
  note: string;
  tone: "neutral" | "good" | "warn";
};

export const kpis: Kpi[] = [
  { label: "Occupancy", value: "91%", note: "+4 pts vs last week", tone: "good" },
  { label: "Arrivals", value: "146", note: "Peak arrivals 3:00–5:00 PM", tone: "neutral" },
  { label: "Departures", value: "128", note: "Most check-outs by 11:00 AM", tone: "neutral" },
  { label: "Guest Sentiment", value: "82/100", note: "-2 pts vs last month", tone: "warn" },
  { label: "Operational Alerts", value: "4", note: "1 high priority", tone: "warn" },
  { label: "Revenue Opportunities", value: "$2,850", note: "3 suggested actions", tone: "good" },
];

export type Alert = {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  why: string;
};

export const alerts: Alert[] = [
  {
    id: "a1",
    severity: "high",
    title: "Front-office complaints up 18%",
    detail:
      "Check-in queue complaints rose compared with last month. Consider additional front-office coverage between 3 PM and 5 PM.",
    why: "Check-in mentions rose from 55 to 65 in the last 30 days, and arrivals peak at 3–5 PM, which matches the timing in the complaints.",
  },
  {
    id: "a2",
    severity: "medium",
    title: "Breakfast waiting times increasing",
    detail:
      "Guests report queues at the breakfast restaurant on weekends. Consider opening the overflow area from 8:00 AM.",
    why: "Breakfast complaints are the second most common issue this week, and 9 of 12 mention waiting or crowding.",
  },
  {
    id: "a3",
    severity: "medium",
    title: "Wi-Fi complaints on Level 3",
    detail:
      "Several guests on Level 3 report a weak or dropping connection. Consider asking Maintenance to inspect the access points.",
    why: "7 Wi-Fi complaints in the last 14 days, 6 of them from Level 3 rooms.",
  },
  {
    id: "a4",
    severity: "low",
    title: "2 VIP arrivals today",
    detail:
      "Both rooms are currently marked as not yet cleaned. Consider prioritising them in the housekeeping schedule.",
    why: "VIP arrivals are due before 2:00 PM and the rooms are still on the housekeeping list.",
  },
];
