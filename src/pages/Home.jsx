import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import SetupBanner from '../components/SetupBanner';

export default function Home() {
  const { role, isAuthenticated } = useAuth();

  return (
    <div>
      <SetupBanner />
      <section className="text-center py-8">
        <div className="inline-block rounded-full bg-slate-900 p-3 shadow-lg mb-4 ring-2 ring-frost-200">
          <Logo size="lg" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-frost-900 mb-3">
          Bienvenido a FrostBite
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Digitalizamos el menú, inventario y ventas de la heladería más popular de la ciudad.
          Copas y malteadas artesanales con ingredientes frescos.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow border border-frost-100">
          <h2 className="font-bold text-frost-800 mb-2">Productos</h2>
          <p className="text-sm text-slate-600 mb-4">
            Explora copas y malteadas. {role === 'publico' ? 'Vista pública del menú.' : 'Incluye calorías y más según tu rol.'}
          </p>
          <Link
            to="/productos"
            className="inline-block bg-frost-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-frost-700"
          >
            Ver menú
          </Link>
        </div>

        {isAuthenticated && (
          <div className="bg-white rounded-2xl p-6 shadow border border-frost-100">
            <h2 className="font-bold text-frost-800 mb-2">Tu acceso</h2>
            <p className="text-sm text-slate-600">
              Sesión activa como <strong className="capitalize">{role}</strong>. Las funciones del menú
              superior se adaptan a tu rol.
            </p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-white rounded-2xl p-6 shadow border border-frost-100">
            <h2 className="font-bold text-frost-800 mb-2">Cuentas de prueba</h2>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                <strong>Admin:</strong> admin@admin.co / admin
              </li>
              <li>
                <strong>Empleado:</strong> empleado@empleado.co / empleado
              </li>
              <li>
                <strong>Cliente:</strong> cliente@cliente.co / cliente
              </li>
            </ul>
            <Link
              to="/login"
              className="inline-block mt-4 bg-frost-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-frost-700"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
