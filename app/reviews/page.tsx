import KpiCard from "@/components/KpiCard";
import IssuesChart from "@/components/IssuesChart";
import TrendChart from "@/components/TrendChart";
import { analysed } from "@/lib/reviews";
import {
  categoryCounts, monthOnMonth, overallScore, trendData,
} from "@/lib/analytics";

function describeChange(c: ReturnType<typeof monthOnMonth>) {
  const counts = `${c.prev} in ${c.prevMonth} to ${c.last} in ${c.lastMonth}`;
  if (c.change === null) return `${c.category} complaints went from ${counts}.`;
  const direction = c.change >= 0 ? "increased" : "decreased";
  return `${c.category} complaints ${direction} ${Math.abs(c.change)}% (${counts}).`;
}

export default function ReviewsPage() {
  const total = analysed.length;
  const issues = categoryCounts(analysed, "negative");
  const compliments = categoryCounts(analysed, "positive");
  const withComplaint = analysed.filter((r) =>
    r.mentions.some((m) => m.sentiment === "negative")
  ).length;

  const topIssueNames = issues.slice(0, 3).map((i) => i.category);
  const changes = topIssueNames.map((name) => monthOnMonth(name));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Guest Experience Intelligence</h1>
        <p className="mt-1 text-sm text-slate-500">
          Synthetic reviews, April to September 2026. All figures are calculated from the data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Reviews analysed" value={String(total)} note="6 months of synthetic reviews" tone="neutral" />
        <KpiCard label="Overall sentiment" value={`${overallScore(analysed)}/100`} note="Average star rating, scaled to 100" tone="good" />
        <KpiCard
          label="Reviews with a complaint"
          value={`${Math.round((withComplaint / total) * 100)}%`}
          note={`${withComplaint} of ${total} reviews`}
          tone="warn"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Top issues</h2>
        <p className="mb-4 text-sm text-slate-500">
          Number of reviews that mention a problem in each area.
        </p>
        <IssuesChart data={issues.slice(0, 8)} />

        <table className="mt-6 w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2 font-medium">Area</th>
              <th className="py-2 font-medium">Mentions</th>
              <th className="py-2 font-medium">% of reviews</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issues.slice(0, 8).map((i) => (
              <tr key={i.category}>
                <td className="py-2 text-slate-900">{i.category}</td>
                <td className="py-2 text-slate-700">{i.count}</td>
                <td className="py-2 text-slate-700">{i.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Top compliments</h2>
        <p className="mb-4 text-sm text-slate-500">What guests praise most often.</p>
        <ul className="divide-y divide-slate-100 text-sm">
          {compliments.slice(0, 5).map((c) => (
            <li key={c.category} className="flex justify-between py-2">
              <span className="text-slate-900">{c.category}</span>
              <span className="text-slate-600">
                {c.count} mentions ({c.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Trends in the top three issues</h2>
        <p className="mb-4 text-sm text-slate-500">Complaint mentions per month.</p>
        <TrendChart data={trendData(topIssueNames)} series={topIssueNames} />

        <h3 className="mt-6 text-sm font-semibold text-slate-900">What changed in the latest month</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {changes.map((c) => (
            <li key={c.category}>{describeChange(c)}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Monthly counts are small, so treat changes as signals to investigate, not proof.
        </p>
      </section>
    </div>
  );
}
