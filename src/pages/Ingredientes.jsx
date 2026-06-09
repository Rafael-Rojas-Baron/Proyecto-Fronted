import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import Loading from '../components/ui/Loading';
import {
  createIngrediente,
  deleteIngrediente,
  getAllIngredientes,
  reabastecerIngrediente,
  updateIngrediente,
} from '../services/ingredientesService';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatMoney } from '../utils/format';

const EMPTY = {
  nombre: '',
  precio: '',
  calorias: '',
  inventario: '',
  es_vegetariano: false,
  es_sano: true,
  tipo: 'base',
  sabor: '',
};

export default function Ingredientes() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      setLista(await getAllIngredientes());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const payloadFromForm = () => ({
    nombre: form.nombre,
    precio: Number(form.precio),
    calorias: Number(form.calorias),
    inventario: Number(form.inventario),
    es_vegetariano: form.es_vegetariano,
    es_sano: form.es_sano,
    tipo: form.tipo,
    sabor: form.tipo === 'base' ? form.sabor : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateIngrediente(editId, payloadFromForm());
      } else {
        await createIngrediente(payloadFromForm());
      }
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (ing) => {
    setEditId(ing.id);
    setForm({
      nombre: ing.nombre,
      precio: String(ing.precio),
      calorias: String(ing.calorias),
      inventario: String(ing.inventario),
      es_vegetariano: ing.es_vegetariano,
      es_sano: ing.es_sano,
      tipo: ing.tipo,
      sabor: ing.sabor || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ingrediente?')) return;
    try {
      await deleteIngrediente(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReabastecer = async (id) => {
    const qty = prompt('¿Cuántas unidades agregar al inventario?', '10');
    if (!qty) return;
    try {
      await reabastecerIngrediente(id, Number(qty));
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const fieldLabels = { nombre: 'Nombre', precio: 'Precio', calorias: 'Calorías', inventario: 'Inventario' };

  return (
    <div>
      <SetupBanner />
      <PageHeader
        title="Ingredientes"
        subtitle="Administra bases, complementos e inventario"
      />

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 mb-8 grid sm:grid-cols-2 gap-5">
        <h2 className="sm:col-span-2 font-display text-lg font-bold text-frost-900">
          {editId ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h2>
        {['nombre', 'precio', 'calorias', 'inventario'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-frost-900 mb-1.5">
              {fieldLabels[field]}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-frost-900 mb-1.5">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="input-field">
            <option value="base">Base</option>
            <option value="complemento">Complemento</option>
          </select>
        </div>
        {form.tipo === 'base' && (
          <div>
            <label className="block text-sm font-semibold text-frost-900 mb-1.5">Sabor</label>
            <input name="sabor" value={form.sabor} onChange={handleChange} className="input-field" />
          </div>
        )}
        <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            name="es_vegetariano"
            checked={form.es_vegetariano}
            onChange={handleChange}
            className="rounded border-slate-300 text-frost-600 focus:ring-frost-500"
          />
          Vegetariano
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            name="es_sano"
            checked={form.es_sano}
            onChange={handleChange}
            className="rounded border-slate-300 text-frost-600 focus:ring-frost-500"
          />
          Sano (regulación salud)
        </label>
        <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-primary">
            {editId ? 'Guardar cambios' : 'Crear ingrediente'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(EMPTY);
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <Loading />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-frost text-sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Calorías</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Tipo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((ing) => (
                  <tr key={ing.id}>
                    <td className="font-medium text-slate-800">{ing.nombre}</td>
                    <td className="text-center">{formatMoney(ing.precio)}</td>
                    <td className="text-center">{ing.calorias}</td>
                    <td className="text-center">
                      <span
                        className={
                          ing.inventario < 5
                            ? 'text-red-600 font-bold'
                            : 'text-slate-700'
                        }
                      >
                        {ing.inventario}
                      </span>
                    </td>
                    <td className="text-center capitalize">
                      <span className={ing.tipo === 'base' ? 'badge-copa' : 'badge-malteada'}>
                        {ing.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2 justify-center min-w-[280px]">
                        <button
                          type="button"
                          onClick={() => startEdit(ing)}
                          className="btn-action-edit"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReabastecer(ing.id)}
                          className="btn-action-stock"
                        >
                          Reabastecer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ing.id)}
                          className="btn-action-delete"
                        >
                          Eliminar
                        </button>
                      </div>
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
