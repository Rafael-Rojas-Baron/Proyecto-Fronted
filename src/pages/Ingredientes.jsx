import { useEffect, useState } from 'react';
import SetupBanner from '../components/SetupBanner';
import {
  createIngrediente,
  deleteIngrediente,
  getAllIngredientes,
  reabastecerIngrediente,
  renovarInventarioComplemento,
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

  const handleRenovar = async (id) => {
    if (!confirm('¿Poner inventario del complemento en 0?')) return;
    try {
      await renovarInventarioComplemento(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <SetupBanner />
      <h1 className="text-3xl font-bold text-frost-900 mb-6">CRUD de ingredientes</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow border p-6 mb-8 grid sm:grid-cols-2 gap-4"
      >
        <h2 className="sm:col-span-2 font-semibold text-frost-800">
          {editId ? 'Editar ingrediente' : 'Nuevo ingrediente'}
        </h2>
        {['nombre', 'precio', 'calorias', 'inventario'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="base">Base</option>
            <option value="complemento">Complemento</option>
          </select>
        </div>
        {form.tipo === 'base' && (
          <div>
            <label className="block text-sm font-medium mb-1">Sabor</label>
            <input
              name="sabor"
              value={form.sabor}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="es_vegetariano"
            checked={form.es_vegetariano}
            onChange={handleChange}
          />
          Vegetariano
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="es_sano" checked={form.es_sano} onChange={handleChange} />
          Sano (regulación salud)
        </label>
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="bg-frost-600 text-white px-4 py-2 rounded-lg font-semibold">
            {editId ? 'Guardar cambios' : 'Crear'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(EMPTY);
              }}
              className="border px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow text-sm">
            <thead className="bg-frost-700 text-white">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Calorías</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((ing) => (
                <tr key={ing.id} className="border-t">
                  <td className="p-3 font-medium">{ing.nombre}</td>
                  <td className="p-3 text-center">{formatMoney(ing.precio)}</td>
                  <td className="p-3 text-center">{ing.calorias}</td>
                  <td className="p-3 text-center">{ing.inventario}</td>
                  <td className="p-3 text-center capitalize">{ing.tipo}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 justify-center">
                      <button
                        type="button"
                        onClick={() => startEdit(ing)}
                        className="text-frost-700 text-xs font-semibold hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReabastecer(ing.id)}
                        className="text-emerald-700 text-xs font-semibold hover:underline"
                      >
                        Reabastecer
                      </button>
                      {ing.tipo === 'complemento' && (
                        <button
                          type="button"
                          onClick={() => handleRenovar(ing.id)}
                          className="text-amber-700 text-xs font-semibold hover:underline"
                        >
                          A 0
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(ing.id)}
                        className="text-red-600 text-xs font-semibold hover:underline"
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
      )}
    </div>
  );
}
