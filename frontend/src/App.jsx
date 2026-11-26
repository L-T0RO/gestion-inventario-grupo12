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
import CategoriasAdminPage from './pages/CategoriasAdminPage';
import ProductosPage from './pages/ProductosPage';
import MovimientosPage from './pages/MovimientosPage';
import { authService } from './services/auth.service';
import { ROLES } from './types/api.types';

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
              <ProductosPage user={user} />
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
                <MovimientosPage user={user} />
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
                <CategoriasAdminPage currentUser={user} />
              )}
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}