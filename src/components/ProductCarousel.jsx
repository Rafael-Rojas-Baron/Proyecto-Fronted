import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';

const AUTO_PLAY_MS = 4000;

export default function ProductCarousel({
  productos,
  showCalorias,
  showCostos,
  showRentabilidad,
}) {
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (productos.length <= 1 || reducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume);

    const goToSlide = (idx) => {
      const cards = track.querySelectorAll('[data-carousel-item]');
      const card = cards[idx];
      if (!card) return;
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
    };

    const interval = setInterval(() => {
      if (pausedRef.current) return;
      indexRef.current = (indexRef.current + 1) % productos.length;
      goToSlide(indexRef.current);
    }, AUTO_PLAY_MS);

    return () => {
      clearInterval(interval);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', resume);
    };
  }, [productos.length, reducedMotion]);

  if (productos.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-hidden snap-x snap-mandatory scroll-smooth pb-4 px-1 -mx-1"
        role="region"
        aria-label="Carrusel de productos"
        aria-live="polite"
      >
        {productos.map((p) => (
          <div
            key={p.id}
            data-carousel-item
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

      {productos.length > 1 && !reducedMotion && (
        <p className="text-center text-xs text-slate-500 mt-2">
        </p>
      )}
    </div>
  );
}
