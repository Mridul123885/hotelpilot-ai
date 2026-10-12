type Props = {
  label: string;
  value: string;
  note: string;
  tone: "neutral" | "good" | "warn";
};

const toneStyles = {
  neutral: "text-slate-500",
  good: "text-emerald-600",
  warn: "text-amber-600",
};

export default function KpiCard({ label, value, note, tone }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className={`mt-2 text-sm ${toneStyles[tone]}`}>{note}</p>
    </div>
  );
}
