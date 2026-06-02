import { formatMoney } from '../utils/format';

export default function ProductCard({
  producto,
  showCalorias,
  showCostos,
  showRentabilidad,
  onVender,
  canSell,
}) {
  const isCopa = producto.tipo === 'copa';

  return (
    <article className="glass-card-hover overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-br from-frost-500 via-frost-600 to-frost-800 px-5 py-4 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" aria-hidden="true" />
        <span className={isCopa ? 'badge-copa bg-white/20 text-white' : 'badge-malteada bg-white/20 text-white'}>
          {producto.tipo}
        </span>
        <h3 className="font-bold text-lg mt-2 relative">{producto.nombre}</h3>
        <p className="text-frost-100 text-sm mt-0.5 relative">
          {isCopa && producto.vaso ? `Vaso ${producto.vaso}` : ''}
          {!isCopa && producto.volumen_onzas ? `${producto.volumen_onzas} oz` : ''}
        </p>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <p className="text-2xl font-bold text-frost-800 tracking-tight">
          {formatMoney(producto.precio_publico)}
        </p>

        <div className="space-y-2 text-sm flex-1">
          {showCalorias && (
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-frost-50">
              <span className="text-slate-600">Calorías</span>
              <span className="font-semibold text-frost-800">{producto.total_calorias} kcal</span>
            </div>
          )}
          {showCostos && (
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-slate-50">
              <span className="text-slate-600">Costo</span>
              <span className="font-medium">{formatMoney(producto.costo)}</span>
            </div>
          )}
          {showRentabilidad && (
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-emerald-50">
              <span className="text-emerald-800">Rentabilidad</span>
              <span className="font-semibold text-emerald-700">
                {formatMoney(producto.rentabilidad)}
              </span>
            </div>
          )}
        </div>

        {producto.ingredientes?.length > 0 && (
          <div className="pt-2 border-t border-frost-100">
            <p className="text-xs font-bold text-frost-600 uppercase tracking-wider mb-2">
              Ingredientes
            </p>
            <ul className="text-sm space-y-1.5">
              {producto.ingredientes.map((ing) => (
                <li key={ing.id} className="flex justify-between gap-2 text-slate-700">
                  <span>{ing.nombre}</span>
                  <span
                    className={`text-xs font-medium ${
                      ing.inventario < 5 ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    {ing.inventario} u.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {canSell && onVender && (
          <button type="button" onClick={() => onVender(producto)} className="btn-primary w-full mt-auto">
            Vender
          </button>
        )}
      </div>
    </article>
  );
}
