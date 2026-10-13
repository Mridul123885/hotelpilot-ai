import KpiCard from "@/components/KpiCard";
import AttentionPanel from "@/components/AttentionPanel";
import { buildAlerts, buildKpis } from "@/lib/dashboard";

export default function DashboardPage() {
  const kpis = buildKpis();
  const alerts = buildAlerts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Today&apos;s Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Synthetic demonstration snapshot for the Demo Hotel. Guest sentiment and alerts are
          calculated from the review data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <AttentionPanel alerts={alerts} />
    </div>
  );
}
