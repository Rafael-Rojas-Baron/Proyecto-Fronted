export default function StatCard({ label, value, accent = 'frost' }) {
  const valueClass =
    accent === 'emerald' ? 'text-emerald-600' : 'text-frost-700';

  return (
    <div className="glass-card p-6 text-center">
      <p className={`text-3xl md:text-4xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500 font-medium">{label}</p>
    </div>
  );
}
