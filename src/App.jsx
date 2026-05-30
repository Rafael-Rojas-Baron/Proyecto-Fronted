import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/permissions';
import Home from './pages/Home';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Ingredientes from './pages/Ingredientes';
import Ventas from './pages/Ventas';
import Panel from './pages/Panel';
import Rentabilidad from './pages/Rentabilidad';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<Productos />} />
            <Route
              path="/ingredientes"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO]}>
                  <Ingredientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ventas"
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO, ROLES.CLIENTE]}
                >
                  <Ventas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/panel"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO]}>
                  <Panel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rentabilidad"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Rentabilidad />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
