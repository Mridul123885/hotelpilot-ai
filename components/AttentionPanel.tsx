import type { Alert } from "@/lib/demo-data";

const severityStyles = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-700",
};

const severityLabel = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function AttentionPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Attention Required</h2>
        <p className="text-sm text-slate-500">
          Suggestions for the manager to review. Final decisions stay with you.
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {alerts.map((alert) => (
          <li key={alert.id} className="px-6 py-4">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${severityStyles[alert.severity]}`}
              >
                {severityLabel[alert.severity]}
              </span>
              <p className="font-medium text-slate-900">{alert.title}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">{alert.detail}</p>

            <details className="mt-2 text-sm">
              <summary className="cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                Why am I seeing this?
              </summary>
              <p className="mt-1 text-slate-500">{alert.why}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
