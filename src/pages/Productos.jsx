import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
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
      setProductos(await getProductosConIngredientes());
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
      <PageHeader
        title="Menú de productos"
        subtitle="Copas y malteadas con ingredientes e información según tu rol"
      >
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-field min-w-[220px] max-w-xs"
          aria-label="Buscar productos"
        />
      </PageHeader>

      {loading && <Loading message="Cargando productos…" />}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && filtrados.length === 0 && (
        <div className="glass-card p-12 text-center text-slate-500">
          No hay productos que coincidan con la búsqueda.
        </div>
      )}

      {!loading && filtrados.length > 0 && (
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
      )}
    </div>
  );
}
