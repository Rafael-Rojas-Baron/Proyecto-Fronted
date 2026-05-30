import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SetupBanner from '../components/SetupBanner';
import { getProductosConIngredientes, venderProducto } from '../services/productosService';
import { canSeeCalorias } from '../utils/permissions';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Ventas() {
  const { user, role } = useAuth();
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      setProductos(await getProductosConIngredientes());
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleVender = async (producto) => {
    setMensaje('');
    try {
      const result = await venderProducto(producto.id, user?.id, 1);
      setMensaje(
        `Venta registrada: ${result.producto.nombre} — Total ${result.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`
      );
      load();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  return (
    <div>
      <SetupBanner />
      <h1 className="text-3xl font-bold text-frost-900 mb-2">Venta de productos</h1>
      <p className="text-slate-600 mb-6">
        Verifica inventario, descuenta ingredientes y registra la venta del día.
      </p>

      {mensaje && (
        <p
          className={`mb-4 p-3 rounded-lg text-sm ${
            mensaje.startsWith('Venta') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
          }`}
        >
          {mensaje}
        </p>
      )}

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              showCalorias={canSeeCalorias(role)}
              showCostos={false}
              showRentabilidad={false}
              canSell
              onVender={handleVender}
            />
          ))}
        </div>
      )}
    </div>
  );
}
