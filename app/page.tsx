import KpiCard from "@/components/KpiCard";
import AttentionPanel from "@/components/AttentionPanel";
import { kpis, alerts } from "@/lib/demo-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Today&apos;s Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Synthetic demonstration snapshot for the Demo Hotel.
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
