import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
import { getContadorVentasDelDia } from '../services/ventasService';
import { formatMoney } from '../utils/format';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Panel() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getContadorVentasDelDia()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <SetupBanner />
      <h1 className="text-3xl font-bold text-frost-900 mb-6">Panel del día</h1>
      {error && <p className="text-red-600">{error}</p>}
      {stats && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow border text-center">
              <p className="text-3xl font-bold text-frost-700">{stats.cantidadVentas}</p>
              <p className="text-sm text-slate-500">Transacciones hoy</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow border text-center">
              <p className="text-3xl font-bold text-frost-700">{stats.unidades}</p>
              <p className="text-sm text-slate-500">Unidades vendidas</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow border text-center">
              <p className="text-3xl font-bold text-emerald-600">{formatMoney(stats.ingresos)}</p>
              <p className="text-sm text-slate-500">Ingresos del día</p>
            </div>
          </div>
          <h2 className="font-semibold text-frost-800 mb-3">Ventas de hoy</h2>
          <ul className="bg-white rounded-xl shadow divide-y">
            {stats.ventas.length === 0 ? (
              <li className="p-4 text-slate-500 text-center">Sin ventas hoy aún</li>
            ) : (
              stats.ventas.map((v) => (
                <li key={v.id} className="p-4 flex justify-between text-sm">
                  <span>
                    {v.productos?.nombre} × {v.cantidad}
                  </span>
                  <span className="font-medium">{formatMoney(v.total)}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
