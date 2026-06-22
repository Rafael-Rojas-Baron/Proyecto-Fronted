import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
import {
  getProductoMasRentable,
  getProductosConIngredientes,
} from '../services/productosService';
import { formatMoney } from '../utils/format';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Rentabilidad() {
  const [productos, setProductos] = useState([]);
  const [top, setTop] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    Promise.all([getProductosConIngredientes(), getProductoMasRentable()])
      .then(([list, best]) => {
        setProductos([...list].sort((a, b) => b.rentabilidad - a.rentabilidad));
        setTop(best);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SetupBanner />
      <PageHeader
        title="Rentabilidad"
        subtitle="Análisis de costos, precios y margen por producto"
      />

      {error && <Alert variant="error">{error}</Alert>}
      {loading && <Loading />}

      {top && (
        <div className="rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-frost-500 via-frost-600 to-frost-700 text-white shadow-card relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
          <p className="text-xs uppercase tracking-widest font-semibold opacity-90 relative">
            Producto más rentable
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold mt-2 relative">{top.nombre}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm relative">
            <span className="bg-white/15 rounded-lg px-3 py-1.5">
              Rentabilidad: <strong>{formatMoney(top.rentabilidad)}</strong>
            </span>
            <span className="bg-white/15 rounded-lg px-3 py-1.5">
              Público: {formatMoney(top.precio_publico)}
            </span>
            <span className="bg-white/15 rounded-lg px-3 py-1.5">
              Costo: {formatMoney(top.costo)}
            </span>
          </div>
        </div>
      )}

      {!loading && productos.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-frost text-sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Precio público</th>
                  <th className="text-center">Costo</th>
                  <th className="text-center">Rentabilidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-slate-800">{p.nombre}</td>
                    <td className="text-center">{formatMoney(p.precio_publico)}</td>
                    <td className="text-center text-slate-600">{formatMoney(p.costo)}</td>
                    <td className="text-center font-bold text-emerald-700">
                      {formatMoney(p.rentabilidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
