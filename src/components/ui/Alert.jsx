const variants = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-frost-50 border-frost-200 text-frost-900',
};

export default function Alert({ variant = 'info', children, className = '' }) {
  return (
    <div
      className={`mb-6 rounded-xl border p-4 text-sm ${variants[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
