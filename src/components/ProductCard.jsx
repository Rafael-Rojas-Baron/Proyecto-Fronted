import { formatMoney } from '../utils/format';

export default function ProductCard({
  producto,
  showCalorias,
  showCostos,
  showRentabilidad,
  onVender,
  canSell,
}) {
  return (
    <article className="bg-white rounded-2xl shadow-md border border-frost-100 overflow-hidden hover:shadow-lg transition">
      <div className="bg-gradient-to-r from-frost-500 to-frost-700 px-4 py-3 text-white">
        <h3 className="font-bold text-lg">{producto.nombre}</h3>
        <p className="text-frost-100 text-sm capitalize">
          {producto.tipo}
          {producto.tipo === 'copa' && producto.vaso ? ` · Vaso ${producto.vaso}` : ''}
          {producto.tipo === 'malteada' && producto.volumen_onzas
            ? ` · ${producto.volumen_onzas} oz`
            : ''}
        </p>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-2xl font-bold text-frost-800">
          {formatMoney(producto.precio_publico)}
        </p>

        {showCalorias && (
          <p className="text-sm">
            <span className="font-semibold text-frost-700">Calorías:</span>{' '}
            {producto.total_calorias} kcal
          </p>
        )}

        {showCostos && (
          <p className="text-sm text-slate-600">
            Costo producción: {formatMoney(producto.costo)}
          </p>
        )}

        {showRentabilidad && (
          <p className="text-sm text-emerald-700 font-medium">
            Rentabilidad: {formatMoney(producto.rentabilidad)}
          </p>
        )}

        {producto.ingredientes?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-frost-600 uppercase mb-1">
              Ingredientes
            </p>
            <ul className="text-sm space-y-1">
              {producto.ingredientes.map((ing) => (
                <li key={ing.id} className="flex justify-between gap-2">
                  <span>{ing.nombre}</span>
                  <span className="text-slate-500">Stock: {ing.inventario}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {canSell && onVender && (
          <button
            type="button"
            onClick={() => onVender(producto)}
            className="w-full mt-2 bg-frost-600 hover:bg-frost-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Vender
          </button>
        )}
      </div>
    </article>
  );
}
