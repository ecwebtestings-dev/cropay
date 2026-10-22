export default function SummaryCard({ label, value, featured = false }) {
  return (
    <div
      className={`rounded-md border p-5 sm:p-6 ${
        featured ? "border-emerald-700 bg-[#12372B] text-white" : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <p className="text-2xl font-bold sm:text-3xl">{value}</p>
      <p className={`mt-1 text-sm ${featured ? "text-white/80" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}