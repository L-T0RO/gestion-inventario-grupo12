import { useState } from 'react';
import { authService } from '../services/auth.service';

export default function ProfilePage({ user, onUserUpdated }) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [cargo, setCargo] = useState(user?.cargo || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      const res = await authService.updateProfile({ nombre, cargo });
      if (onUserUpdated) onUserUpdated(res.data);
      setMessage(res.msg);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Perfil de Usuario</h1>

      <div className="card" style={{ maxWidth: '600px' }}>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            paddingBottom: '1rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <strong>Correo:</strong> {user.email}
          </div>
          <div>
            <strong>Rol del sistema:</strong>{' '}
            <span className="badge badge-info">{user.rol}</span>
          </div>
          <div>
            <strong>Legajo:</strong> {user.legajo || 'N/A'}
          </div>
          <div>
            <strong>Estado:</strong>{' '}
            <span className="badge badge-success">Activo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="profile-nombre">Nombre completo</label>
            <input
              id="profile-nombre"
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-cargo">Cargo / Puesto</label>
            <input
              id="profile-cargo"
              type="text"
              className="form-control"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}