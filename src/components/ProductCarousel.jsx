import { useRef } from 'react';
import ProductCard from './ProductCard';

export default function ProductCarousel({
  productos,
  showCalorias,
  showCostos,
  showRentabilidad,
}) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.85;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (productos.length === 0) return null;

  return (
    <div className="relative">
      {productos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-3 h-11 w-11 items-center justify-center rounded-full bg-white shadow-card border border-frost-100 text-frost-700 hover:bg-frost-50 transition"
            aria-label="Producto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-3 h-11 w-11 items-center justify-center rounded-full bg-white shadow-card border border-frost-100 text-frost-700 hover:bg-frost-50 transition"
            aria-label="Producto siguiente"
          >
            ›
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-1 -mx-1 scrollbar-thin"
        role="region"
        aria-label="Carrusel de productos"
      >
        {productos.map((p) => (
          <div
            key={p.id}
            className="snap-center shrink-0 w-[min(100%,320px)] sm:w-[300px] md:w-[320px]"
          >
            <ProductCard
              producto={p}
              showCalorias={showCalorias}
              showCostos={showCostos}
              showRentabilidad={showRentabilidad}
              canSell={false}
            />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500 mt-2 sm:hidden">
        Desliza para ver más productos →
      </p>
    </div>
  );
}
