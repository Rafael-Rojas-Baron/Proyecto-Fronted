import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import SetupBanner from '../components/SetupBanner';

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
      <div className="bg-white rounded-2xl shadow-lg border border-frost-100 p-8">
        <h1 className="text-2xl font-bold text-frost-900 mb-2">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mb-6">
          Autenticación contra la tabla <code>users</code> de Supabase (correo y contraseña).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="correo">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-frost-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-frost-500 outline-none"
              required
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-frost-600 hover:bg-frost-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg"
          >
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
