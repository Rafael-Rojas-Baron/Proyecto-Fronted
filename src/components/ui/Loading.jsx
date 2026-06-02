export default function Loading({ message = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="h-10 w-10 rounded-full border-2 border-frost-200 border-t-frost-600 animate-spin"
        aria-hidden="true"
      />
      <p className="text-slate-500 text-sm font-medium">{message}</p>
    </div>
  );
}
