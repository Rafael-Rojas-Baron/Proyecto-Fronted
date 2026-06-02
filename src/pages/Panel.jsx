import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
import { getContadorVentasDelDia } from '../services/ventasService';
import { formatMoney } from '../utils/format';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Panel() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    getContadorVentasDelDia()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SetupBanner />
      <PageHeader title="Panel del día" subtitle="Resumen de ventas e ingresos de hoy" />

      {error && <Alert variant="error">{error}</Alert>}
      {loading && <Loading />}
      {stats && (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <StatCard label="Transacciones hoy" value={stats.cantidadVentas} />
            <StatCard label="Unidades vendidas" value={stats.unidades} />
            <StatCard label="Ingresos del día" value={formatMoney(stats.ingresos)} accent="emerald" />
          </div>

          <h2 className="font-display text-lg font-bold text-frost-900 mb-4">Ventas de hoy</h2>
          <ul className="glass-card divide-y divide-frost-100 overflow-hidden">
            {stats.ventas.length === 0 ? (
              <li className="p-8 text-slate-500 text-center">Sin ventas registradas hoy</li>
            ) : (
              stats.ventas.map((v) => (
                <li
                  key={v.id}
                  className="p-4 flex justify-between items-center text-sm hover:bg-frost-50/50 transition"
                >
                  <span className="font-medium text-slate-800">
                    {v.productos?.nombre}{' '}
                    <span className="text-slate-500 font-normal">× {v.cantidad}</span>
                  </span>
                  <span className="font-bold text-frost-700">{formatMoney(v.total)}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
