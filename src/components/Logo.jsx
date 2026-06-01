const LOGO_SRC = '/logo-capy.png';

export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-28 w-28 md:h-32 md:w-32',
  };

  return (
    <img
      src={LOGO_SRC}
      alt="Logo CAPY WORKS — Heladería FrostBite"
      className={`object-contain shrink-0 ${sizes[size] ?? sizes.md} ${className}`}
    />
  );
}
