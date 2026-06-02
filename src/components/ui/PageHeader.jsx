export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-frost-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-slate-600 text-base max-w-xl">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}
