import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import SetupBanner from '../components/SetupBanner';
import Logo from '../components/Logo';
import Alert from '../components/ui/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Configura Supabase en el archivo .env primero.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(correo, password);
      navigate('/productos');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <SetupBanner />
      <div className="glass-card p-8 md:p-10 shadow-card">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="rounded-full bg-slate-900 p-2 mb-4 ring-2 ring-frost-200">
            <Logo size="md" />
          </div>
          <h1 className="font-display text-2xl font-bold text-frost-900">Iniciar sesión</h1>
          <p className="text-sm text-slate-500 mt-2">
            Accede con tu correo y contraseña registrados en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-frost-900 mb-1.5" htmlFor="correo">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="input-field"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-frost-900 mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          {error && <Alert variant="error">{error}</Alert>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
