import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SetupBanner from '../components/SetupBanner';
import { getProductosConIngredientes, venderProducto } from '../services/productosService';
import {
  canSeeCalorias,
  canSeeCostos,
  canSeeRentabilidad,
  canSell,
} from '../utils/permissions';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Productos() {
  const { role, user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const load = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getProductosConIngredientes();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVender = async (producto) => {
    if (!canSell(role)) return;
    try {
      await venderProducto(producto.id, user?.id, 1);
      alert(`¡Venta exitosa! ${producto.nombre}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <SetupBanner />
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-frost-900">Menú de productos</h1>
          <p className="text-slate-600">Copas y malteadas con sus ingredientes</p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 min-w-[200px]"
        />
      </div>

      {loading && <p className="text-center py-8">Cargando productos…</p>}
      {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            showCalorias={canSeeCalorias(role)}
            showCostos={canSeeCostos(role)}
            showRentabilidad={canSeeRentabilidad(role)}
            canSell={canSell(role)}
            onVender={handleVender}
          />
        ))}
      </div>
    </div>
  );
}
