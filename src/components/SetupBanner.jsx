import Alert from './ui/Alert';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SetupBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <Alert variant="warning">
      <p className="font-semibold">Supabase no configurado</p>
      <p className="mt-1 opacity-90">
        Crea <code className="bg-amber-100/80 px-1.5 py-0.5 rounded">.env</code> con{' '}
        <code className="bg-amber-100/80 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> y{' '}
        <code className="bg-amber-100/80 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.
        Ver <code className="bg-amber-100/80 px-1.5 py-0.5 rounded">CONFIGURACION.md</code>.
      </p>
    </Alert>
  );
}
