import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import SidebarMenu from './components/layout/SidebarMenu';
import Footer from './components/layout/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import DashboardHomePage from './pages/DashboardHomePage';
import { authService } from './services/auth.service';
import { ROLES } from './types/api.types';

function ModuloPlaceholder({ titulo, responsable }) {
  return (
    <div className="card">
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{titulo}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Módulo asignado a: <strong>{responsable}</strong>. Listo para conectar.
      </p>
    </div>
  );
}

function ProtectedLayout({ user, onLogout, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <SidebarMenu user={user} />
      <div className="app-main-wrapper">
        <Header user={user} onLogout={onLogout} />
        <main className="app-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLoginSuccess={setUser} />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />

        <Route
          path="/"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <DashboardHomePage user={user} />
            </ProtectedLayout>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <ProfilePage user={user} onUserUpdated={setUser} />
            </ProtectedLayout>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <ModuloPlaceholder
                titulo="Stock e Inventario (Productos)"
                responsable="Lucas Rojas (Legajo 22269)"
              />
            </ProtectedLayout>
          }
        />

        <Route
          path="/movimientos"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              {user?.rol === ROLES.VENDEDOR ? (
                <Navigate to="/" replace />
              ) : (
                <ModuloPlaceholder
                  titulo="Movimientos y Auditoría"
                  responsable="Tiago de Rosa Cajarabilla (Legajo 22850)"
                />
              )}
            </ProtectedLayout>
          }
        />

        <Route
          path="/categorias"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              {user?.rol !== ROLES.ADMIN ? (
                <Navigate to="/" replace />
              ) : (
                <ModuloPlaceholder
                  titulo="Categorías y Administración"
                  responsable="Máximo Martinez Moraes (Legajo 22331)"
                />
              )}
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}