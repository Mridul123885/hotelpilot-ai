// Generates synthetic hotel reviews (fictional data only).
// Run from the project root:  node scripts/generate-reviews.mjs
import { writeFileSync, mkdirSync } from "node:fs";

// A seeded random number generator, so the output is identical every run.
function mulberry32(seed) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261012);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// weight = how often the category is mentioned, neg = base chance a mention is negative
const CATS = {
  "Check-in": {
    weight: 14, neg: 0.45,
    bad: [
      "Check-in took 30 minutes and there was a long queue.",
      "Arrived mid-afternoon and waited ages in the check-in line with only one person at the desk.",
      "Our room wasn't ready at check-in time and we were left waiting in the lobby.",
      "Check-in was slow and disorganised, with a big queue of tired travellers.",
    ],
    good: [
      "Check-in was quick and the receptionist was lovely.",
      "Smooth check-in, we were in our room within minutes.",
      "Early check-in was arranged without any fuss, which was a great start.",
    ],
  },
  "Front Desk": {
    weight: 7, neg: 0.4,
    bad: [
      "The front desk seemed understaffed and phone calls went unanswered.",
      "Had to queue at the front desk just to ask a simple question.",
      "Front desk staff gave us conflicting information about our booking.",
    ],
    good: [
      "The front desk team were helpful and sorted our booking issue straight away.",
      "Great recommendations from the front desk for dinner nearby.",
      "Front desk was professional and always had a smile.",
    ],
  },
  "Check-out": {
    weight: 3, neg: 0.3,
    bad: [
      "Check-out was slow because of a billing mistake that took ages to fix.",
      "Long queue at check-out on Sunday morning, nearly missed our flight.",
      "Was charged for a minibar item we never used and it took a while to be removed.",
    ],
    good: [
      "Check-out was fast and painless.",
      "Express check-out made leaving easy before our flight.",
      "Staff were flexible about our departure time, which was much appreciated.",
    ],
  },
  Housekeeping: {
    weight: 8, neg: 0.35,
    bad: [
      "Our room was not cleaned until late afternoon.",
      "The bathroom wasn't properly cleaned when we arrived, there was hair in the shower.",
      "Asked for extra towels twice and they never arrived.",
      "Housekeeping skipped our room for a day without any explanation.",
    ],
    good: [
      "The room was spotless and the housekeeping team did a wonderful job.",
      "Housekeeping were quick to bring extra pillows when we asked.",
      "Loved that the room was freshly cleaned every day.",
    ],
  },
  Room: {
    weight: 11, neg: 0.2,
    bad: [
      "The room felt dated and the bed was uncomfortable.",
      "The room was smaller than expected for the price.",
      "Air conditioning was either too cold or too hot, we couldn't get it comfortable.",
    ],
    good: [
      "Beautiful room with a comfortable bed and a great view.",
      "The room was modern, bright and very comfortable.",
      "Loved the spacious room and the quality of the linen.",
    ],
  },
  Breakfast: {
    weight: 11, neg: 0.4,
    bad: [
      "Breakfast was overcrowded and we had to wait for a table.",
      "Ran out of hot food at breakfast by 9:30 and it wasn't refilled.",
      "Long queue for the breakfast buffet and not enough seating.",
      "Breakfast was chaotic on the weekend, with dirty tables everywhere.",
    ],
    good: [
      "Breakfast had a fantastic selection and the coffee was excellent.",
      "Loved the breakfast, fresh fruit and a great cooked menu.",
      "Breakfast was well run and the staff kept everything topped up.",
    ],
  },
  "Food & Beverage": {
    weight: 6, neg: 0.25,
    bad: [
      "Dinner at the restaurant was average and overpriced.",
      "Room service took over an hour to arrive and the food was cold.",
      "The bar was understaffed and drinks took a long time.",
    ],
    good: [
      "Dinner at the restaurant was excellent, especially the local seafood.",
      "The bar had a great atmosphere and the cocktails were well made.",
      "Room service arrived quickly and was hot and tasty.",
    ],
  },
  "Wi-Fi": {
    weight: 6, neg: 0.7,
    bad: [
      "Wi-Fi kept dropping out in our room on Level 3, impossible to join a video call.",
      "The internet on Level 3 was painfully slow in the evenings.",
      "Wi-Fi in the lobby was fine but my room on Level 3 had almost no signal.",
      "Had to ask for the Wi-Fi password twice and the connection was patchy.",
      "Wi-Fi was unreliable and slow for working remotely.",
    ],
    good: [
      "Wi-Fi was fast and reliable throughout our stay.",
      "Easy to connect to the Wi-Fi and speeds were great for working remotely.",
      "Strong Wi-Fi in the room, no issues streaming.",
    ],
  },
  Staff: {
    weight: 13, neg: 0.1,
    bad: [
      "One staff member was dismissive when we raised an issue.",
      "Staff seemed rushed and unfriendly during our stay.",
      "Felt like staff didn't know how to answer basic questions.",
    ],
    good: [
      "Staff were incredibly friendly and welcoming.",
      "Every team member we met went out of their way to help.",
      "The staff made our anniversary stay feel special.",
    ],
  },
  Service: {
    weight: 6, neg: 0.25,
    bad: [
      "Service was slow and we had to ask several times for things.",
      "Requests to the room took far too long to be actioned.",
      "Nobody followed up after we reported a problem.",
    ],
    good: [
      "Service was attentive without being intrusive.",
      "Our requests were handled quickly and politely.",
      "Excellent service from the moment we arrived.",
    ],
  },
  Noise: {
    weight: 4, neg: 0.7,
    bad: [
      "Very noisy at night, we could hear the street and the corridor.",
      "Loud guests next door kept us up until 2 am and nothing was done.",
      "Thin walls and early-morning deliveries woke us every day.",
    ],
    good: [
      "Quiet room and a very restful night's sleep.",
      "Surprisingly peaceful for a city hotel.",
      "Block-out curtains and quiet rooms meant we slept brilliantly.",
    ],
  },
  Parking: {
    weight: 4, neg: 0.5,
    bad: [
      "Parking was expensive and the car park was very tight.",
      "Hard to find a parking spot and no one could tell us where to go.",
      "The car park was full on arrival and we had to park elsewhere.",
    ],
    good: [
      "Parking was easy and secure.",
      "Convenient on-site parking with plenty of space.",
      "Self parking was simple and reasonably priced.",
    ],
  },
  Location: {
    weight: 8, neg: 0.05,
    bad: [
      "Location is a bit far from the main shopping area.",
      "A long walk to the nearest cafes and restaurants.",
      "The area felt quiet in the evening with few dining options nearby.",
    ],
    good: [
      "Perfect location, a short walk to the waterfront and train station.",
      "Great location for exploring the city on foot.",
      "Easy access to the airport and city centre.",
    ],
  },
  Maintenance: {
    weight: 3, neg: 0.7,
    bad: [
      "The shower drain was blocked and it took a day to be fixed.",
      "The lift was out of service for part of our stay.",
      "A light in the bathroom didn't work and wasn't repaired.",
    ],
    good: [
      "Everything in the room worked perfectly.",
      "A small maintenance issue was fixed within the hour.",
      "Facilities were in excellent condition.",
    ],
  },
  Other: {
    weight: 3, neg: 0.3,
    bad: [
      "The pool area was crowded and the gym equipment was limited.",
      "Hotel facilities were a little disappointing for the rate.",
      "Not great value for money compared with similar hotels.",
    ],
    good: [
      "Great pool and gym facilities.",
      "A lovely hotel overall and we would stay again.",
      "Good value for money.",
    ],
  },
};
const NAMES = Object.keys(CATS);

// Built-in patterns. Index 0 = April ... 5 = September.
const VOLUME = {
  "Check-in": [1.0, 1.0, 1.0, 1.1, 1.2, 1.5],
  "Wi-Fi": [0.4, 0.4, 0.6, 1.0, 1.6, 1.9],
};
const NEG_TREND = {
  "Check-in": [1.0, 1.0, 1.05, 1.1, 1.15, 1.45],
  Breakfast: [1.0, 1.0, 1.0, 1.1, 1.2, 1.35],
};

function weightedPick(names, weightOf) {
  const weights = names.map(weightOf);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < names.length; i++) {
    r -= weights[i];
    if (r <= 0) return names[i];
  }
  return names[names.length - 1];
}

function makePart(cat, month, weekend) {
  let p = CATS[cat].neg;
  if (NEG_TREND[cat]) p *= NEG_TREND[cat][month];
  if (cat === "Breakfast" && weekend) p *= 1.4;
  p = Math.min(p, 0.92);
  const negative = rand() < p;
  return {
    category: cat,
    sentiment: negative ? "negative" : "positive",
    text: pick(negative ? CATS[cat].bad : CATS[cat].good),
  };
}

function ratingFor(parts) {
  const neg = parts.filter((p) => p.sentiment === "negative").length;
  const pos = parts.length - neg;
  const r = rand();
  if (neg === 0) return r < 0.65 ? 5 : 4;
  if (pos === 0) return r < 0.4 ? 1 : r < 0.8 ? 2 : 3;
  return r < 0.6 ? 3 : r < 0.85 ? 4 : 2;
}

const OPENERS = [
  "", "", "", "Stayed for a weekend away. ", "Business trip. ",
  "Two nights here. ", "Family holiday. ", "Stayed for a conference. ",
];

const START = Date.UTC(2026, 3, 1); // 1 April 2026
const DAYS = 183; // 1 April to 30 September 2026
const TOTAL = 500;

const rows = [];
for (let n = 0; n < TOTAL; n++) {
  const d = new Date(START + Math.floor(rand() * DAYS) * 86400000);
  const month = d.getUTCMonth() - 3;
  const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
  const weightOf = (name) => CATS[name].weight * (VOLUME[name] ? VOLUME[name][month] : 1);

  const first = makePart(weightedPick(NAMES, weightOf), month, weekend);
  const parts = [first];
  if (rand() < 0.45) {
    const other = weightedPick(NAMES.filter((x) => x !== first.category), weightOf);
    parts.push(makePart(other, month, weekend));
  }

  rows.push({
    date: d.toISOString().slice(0, 10),
    month,
    rating: ratingFor(parts),
    text: pick(OPENERS) + parts.map((p) => p.text).join(" "),
    parts,
  });
}
rows.sort((a, b) => a.date.localeCompare(b.date));

const reviews = rows.map((r, i) => ({
  id: "R" + String(i + 1).padStart(3, "0"),
  date: r.date,
  rating: r.rating,
  source: "Synthetic",
  text: r.text,
}));
const labels = rows.map((r, i) => ({
  id: reviews[i].id,
  categories: r.parts.map((p) => ({ category: p.category, sentiment: p.sentiment })),
}));

mkdirSync("data", { recursive: true });
writeFileSync("data/reviews.json", JSON.stringify(reviews, null, 2));
writeFileSync("data/review-labels.json", JSON.stringify(labels, null, 2));
console.log("Wrote " + reviews.length + " reviews to data/reviews.json");

// Quick check that the built-in patterns are present.
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const issuesIn = (inMonth, cat) =>
  inMonth.filter((r) => r.parts.some((p) => p.category === cat && p.sentiment === "negative")).length;
console.table(
  months.map((m, i) => {
    const inMonth = rows.filter((r) => r.month === i);
    return {
      Month: m,
      Reviews: inMonth.length,
      "Check-in issues": issuesIn(inMonth, "Check-in"),
      "Breakfast issues": issuesIn(inMonth, "Breakfast"),
      "Wi-Fi issues": issuesIn(inMonth, "Wi-Fi"),
    };
  })
);
