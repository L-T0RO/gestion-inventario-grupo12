import { NavLink } from 'react-router-dom';
import { ROLES } from '../../types/api.types';

const MENU_ITEMS = [
  {
    to: '/',
    label: 'Inicio / Dashboard',
    roles: [ROLES.ADMIN, ROLES.OPERARIO, ROLES.VENDEDOR],
  },
  {
    to: '/productos',
    label: 'Stock e Inventario',
    roles: [ROLES.ADMIN, ROLES.OPERARIO, ROLES.VENDEDOR],
  },
  {
    to: '/movimientos',
    label: 'Movimientos y Alertas',
    roles: [ROLES.ADMIN, ROLES.OPERARIO],
  },
  {
    to: '/categorias',
    label: 'Categorías y Admin',
    roles: [ROLES.ADMIN],
  },
  {
    to: '/perfil',
    label: 'Mi Perfil',
    roles: [ROLES.ADMIN, ROLES.OPERARIO, ROLES.VENDEDOR],
  },
];

export default function SidebarMenu({ user }) {
  const allowedItems = MENU_ITEMS.filter(
    (item) => !user || item.roles.includes(user.rol)
  );

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--bg-sidebar)',
        color: 'var(--text-light)',
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontSize: '0.75rem', opacity: 0.7, letterSpacing: '0.05em' }}>
          UTN FRBB • GRUPO 12
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>
          Panel de Control
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {allowedItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              padding: '0.6rem 0.85rem',
              borderRadius: '6px',
              color: '#f8fafc',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}