import { isSupabaseConfigured } from '../lib/supabase';

export default function SetupBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm">
      <p className="font-semibold">Supabase no configurado</p>
      <p className="mt-1">
        Crea el archivo <code className="bg-amber-100 px-1 rounded">.env</code> con{' '}
        <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> y{' '}
        <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.
        Consulta <code>CONFIGURACION.md</code> para el paso a paso.
      </p>
    </div>
  );
}
