import reviewsRaw from "@/data/reviews.json";
import labelsRaw from "@/data/review-labels.json";

export type Sentiment = "positive" | "negative";
export type Mention = { category: string; sentiment: Sentiment };
export type Review = {
  id: string;
  date: string;
  rating: number;
  source: string;
  text: string;
};
export type Analysed = Review & { month: string; mentions: Mention[] };

type Label = { id: string; categories: Mention[] };

// For now the categories come from the answer key. In a later stage
// Claude produces them in exactly this format.
const labelById = new Map(
  (labelsRaw as Label[]).map((l) => [l.id, l.categories])
);

export const analysed: Analysed[] = (reviewsRaw as Review[]).map((r) => ({
  ...r,
  month: r.date.slice(0, 7),
  mentions: labelById.get(r.id) ?? [],
}));
