import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
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

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    Promise.all([getProductosConIngredientes(), getProductoMasRentable()])
      .then(([list, best]) => {
        setProductos([...list].sort((a, b) => b.rentabilidad - a.rentabilidad));
        setTop(best);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <SetupBanner />
      <h1 className="text-3xl font-bold text-frost-900 mb-6">Rentabilidad</h1>
      {error && <p className="text-red-600">{error}</p>}
      {top && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <p className="text-sm uppercase tracking-wide opacity-90">Producto más rentable</p>
          <p className="text-2xl font-bold mt-1">{top.nombre}</p>
          <p className="mt-2">
            Rentabilidad: {formatMoney(top.rentabilidad)} · Precio público:{' '}
            {formatMoney(top.precio_publico)} · Costo: {formatMoney(top.costo)}
          </p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow text-sm">
          <thead className="bg-frost-800 text-white">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3">Precio público</th>
              <th className="p-3">Costo</th>
              <th className="p-3">Rentabilidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.nombre}</td>
                <td className="p-3 text-center">{formatMoney(p.precio_publico)}</td>
                <td className="p-3 text-center">{formatMoney(p.costo)}</td>
                <td className="p-3 text-center font-semibold text-emerald-700">
                  {formatMoney(p.rentabilidad)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
