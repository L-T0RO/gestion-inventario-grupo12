import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { ROLES } from '../types/api.types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: ROLES.OPERARIO,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authService.register(form);
      setSuccess(res.msg);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{ marginBottom: '0.25rem' }}>Registro de Usuario</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Alta simulada para prototipo navegable
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-nombre">Nombre completo</label>
            <input
              id="reg-nombre"
              name="nombre"
              type="text"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Correo electrónico</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-rol">Perfil / Rol asignado</label>
            <select
              id="reg-rol"
              name="rol"
              className="form-control"
              value={form.rol}
              onChange={handleChange}
            >
              <option value={ROLES.OPERARIO}>Operario / Depósito</option>
              <option value={ROLES.VENDEDOR}>Vendedor</option>
              <option value={ROLES.ADMIN}>Administrador / Gerente</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Contraseña</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem' }}>
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}