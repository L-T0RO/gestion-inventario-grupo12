import { useState } from 'react';
import { authService } from '../../services/auth.service';
import { categoriasService } from '../../services/categorias.service';
import { ROLES } from '../../types/api.types';

export default function UsuariosPermisosPanel({ currentUser }) {
  const [users, setUsers] = useState(() => authService.listUsersMock());
  const [feedback, setFeedback] = useState('');
  const categoryStats = categoriasService.getSummaryStatsMock();

  const handleRoleChange = (userId, newRole) => {
    const cargoMap = {
      [ROLES.ADMIN]: 'Administrador / Gerente',
      [ROLES.OPERARIO]: 'Operario / Depósito',
      [ROLES.VENDEDOR]: 'Vendedor',
    };
    const updated = authService.updateUserRoleOrStatusMock(userId, {
      rol: newRole,
      cargo: cargoMap[newRole] || newRole,
    });
    setUsers(updated);
    setFeedback('Perfil de usuario actualizado correctamente.');
  };

  const handleToggleActive = (user) => {
    if (currentUser && Number(user.id) === Number(currentUser.id)) {
      setFeedback('No podés desactivar tu propia cuenta de Administrador activa.');
      return;
    }
    const updated = authService.updateUserRoleOrStatusMock(user.id, {
      activo: !user.activo,
    });
    setUsers(updated);
    setFeedback(`Estado de ${user.nombre} actualizado.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Resumen general de administración */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Total Categorías
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {categoryStats.total}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {categoryStats.activas} activas / {categoryStats.inactivas} inactivas
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Productos Categorizados
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {categoryStats.productosAsociados}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Distribuidos en rubros activos
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Usuarios del Sistema
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {users.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {users.filter((u) => u.activo).length} habilitados
          </div>
        </div>
      </section>

      {/* Panel de Usuarios y Permisos */}
      <section className="card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
          Panel de Usuarios y Permisos
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Asignación de perfiles y habilitación de cuentas (exclusivo Administrador / Gerente).
        </p>

        {feedback && <div className="alert alert-success">{feedback}</div>}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Legajo</th>
                <th>Perfil / Rol</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.nombre}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {u.cargo}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.legajo || 'S/N'}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                      value={u.rol}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value={ROLES.ADMIN}>ADMINISTRADOR</option>
                      <option value={ROLES.OPERARIO}>OPERARIO</option>
                      <option value={ROLES.VENDEDOR}>VENDEDOR</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.activo ? 'badge-success' : 'badge-danger'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleActive(u)}
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
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