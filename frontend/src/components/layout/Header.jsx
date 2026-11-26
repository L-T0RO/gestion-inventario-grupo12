import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          {import.meta.env.VITE_APP_NAME || 'Gestión de Inventario - Grupo 12'}
        </strong>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span className="badge badge-info">{user.rol}</span>
          <Link to="/perfil" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
            {user.nombre}
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}