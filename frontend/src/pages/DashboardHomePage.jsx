import { Link } from 'react-router-dom';
import { ROLES } from '../types/api.types';

const STATS_MOCK = [
  { label: 'Productos en Catálogo', value: '128', detail: '6 rubros activos' },
  { label: 'Unidades en Depósito', value: '3.420', detail: 'Stock total disponible' },
  { label: 'Alertas de Stock Mínimo', value: '4', detail: 'Requieren reposición' },
  { label: 'Movimientos del Día', value: '19', detail: '12 ingresos / 7 egresos' },
];

const LOW_STOCK_PREVIEW = [
  { codigo: 'PROD-004', nombre: 'Cable UTP Cat6 305m', stockActual: 3, stockMinimo: 10 },
  { codigo: 'PROD-011', nombre: 'Tóner Láser Negro 85A', stockActual: 2, stockMinimo: 8 },
  { codigo: 'PROD-019', nombre: 'Guantes Nitrilo Caja x100', stockActual: 5, stockMinimo: 15 },
];

export default function DashboardHomePage({ user }) {
  const isAdmin = user?.rol === ROLES.ADMIN;
  const canMoveStock = user?.rol === ROLES.ADMIN || user?.rol === ROLES.OPERARIO;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          Bienvenido, {user?.nombre}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Panel general del Sistema de Gestión de Inventario • Perfil activo:{' '}
          <strong>{user?.rol}</strong>
        </p>
      </div>

      {/* Estadísticas generales */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {STATS_MOCK.map((stat) => (
          <div key={stat.label} className="card">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0.35rem 0' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {stat.detail}
            </div>
          </div>
        ))}
      </section>

      {/* Accesos rápidos */}
      <section className="card">
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Accesos Rápidos</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/productos" className="btn btn-primary">
            Consultar Stock e Inventario
          </Link>
          {canMoveStock && (
            <Link to="/movimientos" className="btn btn-secondary">
              Registrar Entrada / Salida
            </Link>
          )}
          {isAdmin && (
            <Link to="/categorias" className="btn btn-secondary">
              Gestionar Categorías y Usuarios
            </Link>
          )}
          <Link to="/perfil" className="btn btn-secondary">
            Ver Mi Perfil
          </Link>
        </div>
      </section>

      {/* Vista rápida de alertas de stock bajo */}
      <section className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.85rem',
          }}
        >
          <h2 style={{ fontSize: '1.15rem' }}>Alertas de Stock Mínimo</h2>
          {canMoveStock && (
            <Link to="/movimientos" style={{ fontSize: '0.88rem' }}>
              Ver todos los movimientos →
            </Link>
          )}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK_PREVIEW.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.stockActual}</td>
                  <td>{item.stockMinimo}</td>
                  <td>
                    <span className="badge badge-danger">Stock Bajo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}