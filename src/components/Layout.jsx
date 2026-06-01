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
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-frost-600 text-white' : 'text-frost-800 hover:bg-frost-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream-100 to-frost-50">
      <header className="bg-white/90 backdrop-blur border-b border-frost-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="rounded-full bg-slate-900 p-1 shadow-sm ring-1 ring-frost-200">
              <Logo size="md" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-frost-900 group-hover:text-frost-600">
                Heladería FrostBite
              </p>
              <p className="text-xs text-frost-600">Helados artesanales premium</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-1" aria-label="Principal">
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
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Salir ({user.nombre})
              </button>
            )}
          </nav>
        </div>
        <div className="bg-frost-700 text-white text-center text-xs py-1">
          Rol actual: <strong className="capitalize">{role}</strong>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>

      <footer className="bg-frost-900 text-frost-100 text-center py-4 text-sm">
        <p>© 2025 Heladería FrostBite — Proyecto Final React + Supabase + Vercel</p>
      </footer>
    </div>
  );
}
