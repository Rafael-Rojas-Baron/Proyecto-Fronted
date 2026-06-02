import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import {
  canManageIngredientes,
  canSeeRentabilidad,
  canSeeVentasPanel,
  canSell,
} from '../utils/permissions';

export default function Layout({ children }) {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-frost-600 text-white shadow-soft'
        : 'text-frost-800 hover:bg-frost-50 hover:text-frost-700'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 bg-frost-mesh">
      <header className="sticky top-0 z-50 border-b border-frost-100/80 bg-white/75 backdrop-blur-xl shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 group min-w-0">
              <div className="rounded-full bg-slate-900 p-1.5 shadow-glow ring-2 ring-frost-200/80 shrink-0 group-hover:ring-frost-400 transition">
                <Logo size="md" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold text-frost-900 truncate group-hover:text-frost-600 transition">
                  Capy Frost
              </p>
              <p className="text-xs text-frost-600 font-medium">Helados artesanales premium</p>
              </div>
            </Link>

            <nav
              className="flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-frost-50/80 border border-frost-100"
              aria-label="Navegación principal"
            >
              <NavLink to="/" end className={linkClass}>
                Inicio
              </NavLink>
              <NavLink to="/productos" className={linkClass}>
                Productos
              </NavLink>
              {canManageIngredientes(role) && (
                <NavLink to="/ingredientes" className={linkClass}>
                  Ingredientes
                </NavLink>
              )}
              {canSell(role) && (
                <NavLink to="/ventas" className={linkClass}>
                  Vender
                </NavLink>
              )}
              {canSeeVentasPanel(role) && (
                <NavLink to="/panel" className={linkClass}>
                  Panel
                </NavLink>
              )}
              {canSeeRentabilidad(role) && (
                <NavLink to="/rentabilidad" className={linkClass}>
                  Rentabilidad
                </NavLink>
              )}
              {!isAuthenticated ? (
                <NavLink to="/login" className={linkClass}>
                  Ingresar
                </NavLink>
              ) : (
                <button type="button" onClick={handleLogout} className="btn-ghost-danger">
                  Salir ({user.nombre})
                </button>
              )}
            </nav>
          </div>
        </div>
        <div className="bg-gradient-to-r from-frost-800 to-frost-700 text-white text-center text-xs py-1.5 tracking-wide">
          Rol actual: <strong className="capitalize font-semibold">{role}</strong>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-10">{children}</main>

      <footer className="bg-frost-900 text-frost-100 py-5 text-sm w-full mt-auto shrink-0 border-t border-frost-800">
        <div className="relative w-full min-h-[3rem] px-4 sm:px-8 max-w-6xl mx-auto">
          <p className="text-center sm:text-left sm:max-w-[55%] text-xs sm:text-sm leading-relaxed text-frost-200">
            © 2025 Capy Frost — React + Supabase + Vercel
          </p>
          <p className="mt-2 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 text-center sm:text-right text-frost-300 text-xs sm:text-sm whitespace-nowrap">
            Realizado por:{' '}
            <span className="font-semibold text-white">Rafael Antonio Rojas Baron</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
