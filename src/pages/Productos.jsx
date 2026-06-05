import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCarousel from '../components/ProductCarousel';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
import { getProductosConIngredientes } from '../services/productosService';
import {
  canSeeCalorias,
  canSeeCostos,
  canSeeRentabilidad,
  canSell,
} from '../utils/permissions';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Productos() {
  const { role } = useAuth();
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

  return (
    <div>
      <SetupBanner />
      <PageHeader
        title="Menú de productos"
        subtitle="Explora el catálogo de copas y malteadas. Para comprar, usa la pestaña Vender."
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

      {canSell(role) && (
        <p className="mb-6 text-sm text-frost-800 bg-frost-50 border border-frost-100 rounded-xl px-4 py-3">
          ¿Quieres registrar una venta?{' '}
          <Link to="/ventas" className="font-semibold text-frost-600 hover:text-frost-700 underline">
            Ir a Vender
          </Link>
        </p>
      )}

      {loading && <Loading message="Cargando productos…" />}
      {error && <Alert variant="error">{error}</Alert>}

      {!loading && !error && filtrados.length === 0 && (
        <div className="glass-card p-12 text-center text-slate-500">
          No hay productos que coincidan con la búsqueda.
        </div>
      )}

      {!loading && filtrados.length > 0 && (
        <ProductCarousel
          productos={filtrados}
          showCalorias={canSeeCalorias(role)}
          showCostos={canSeeCostos(role)}
          showRentabilidad={canSeeRentabilidad(role)}
        />
      )}
    </div>
  );
}
