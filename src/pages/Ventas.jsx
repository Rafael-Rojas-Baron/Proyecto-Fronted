import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
import { getProductosConIngredientes, venderProducto } from '../services/productosService';
import { canSeeCalorias } from '../utils/permissions';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Ventas() {
  const { user, role } = useAuth();
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('success');
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
      setMensajeTipo('error');
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
      setMensaje(`Venta registrada: ${result.producto.nombre} — ${result.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`);
      setMensajeTipo('success');
      load();
    } catch (err) {
      setMensaje(err.message);
      setMensajeTipo('error');
    }
  };

  return (
    <div>
      <SetupBanner />
      <PageHeader
        title="Venta de productos"
        subtitle="Se valida inventario, se descuentan ingredientes y se registra la venta"
      />

      {mensaje && <Alert variant={mensajeTipo}>{mensaje}</Alert>}

      {loading ? (
        <Loading />
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
