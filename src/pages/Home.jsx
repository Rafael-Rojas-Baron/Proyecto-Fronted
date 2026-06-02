import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import SetupBanner from '../components/SetupBanner';

function FeatureCard({ title, description, children, className = '' }) {
  return (
    <div className={`glass-card-hover p-6 md:p-7 flex flex-col h-full ${className}`}>
      <h2 className="font-display text-xl font-bold text-frost-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">{description}</p>
      {children}
    </div>
  );
}

export default function Home() {
  const { role, isAuthenticated } = useAuth();

  return (
    <div>
      <SetupBanner />

      <section className="relative text-center py-10 md:py-14 mb-10">
        <div className="inline-block rounded-full bg-slate-900 p-4 shadow-glow mb-6 ring-4 ring-frost-200/60">
          <Logo size="lg" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-frost-900 mb-4 tracking-tight">
          Bienvenido a{' '}
          <span className="bg-gradient-to-r from-frost-600 to-frost-800 bg-clip-text text-transparent">
            Capy Frost
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Menú digital, inventario y ventas en un solo lugar. Copas y malteadas con
          ingredientes seleccionados.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <FeatureCard
          title="Productos"
          description={
            role === 'publico'
              ? 'Consulta el menú público de copas y malteadas.'
              : 'Explora el catálogo con detalles según tu rol de acceso.'
          }
        >
          <Link to="/productos" className="btn-primary">
            Ver menú
          </Link>
        </FeatureCard>

        {isAuthenticated ? (
          <FeatureCard
            title="Tu acceso"
            description={`Sesión activa como ${role}. El menú superior muestra solo las opciones permitidas para tu rol.`}
          >
            <span className="badge bg-frost-100 text-frost-800 capitalize w-fit">{role}</span>
          </FeatureCard>
        ) : (
          <FeatureCard
            title="Cuentas de prueba"
            description="Usa estas credenciales para probar los distintos perfiles del sistema."
          >
            <ul className="text-sm text-slate-600 space-y-2 mb-5 text-left w-full">
              <li className="flex justify-between gap-2 border-b border-frost-50 pb-2">
                <span className="font-semibold text-frost-800">Admin</span>
                <span className="text-slate-500">admin@admin.co / admin</span>
              </li>
              <li className="flex justify-between gap-2 border-b border-frost-50 pb-2">
                <span className="font-semibold text-frost-800">Empleado</span>
                <span className="text-slate-500">empleado@empleado.co / empleado</span>
              </li>
              <li className="flex justify-between gap-2">
                <span className="font-semibold text-frost-800">Cliente</span>
                <span className="text-slate-500">cliente@cliente.co / cliente</span>
              </li>
            </ul>
            <Link to="/login" className="btn-primary">
              Iniciar sesión
            </Link>
          </FeatureCard>
        )}
      </div>
    </div>
  );
}
