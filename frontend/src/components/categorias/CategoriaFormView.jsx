import { useEffect, useState } from 'react';
import { CATEGORIA_INITIAL_FORM } from '../../types/categoria.types';

export default function CategoriaFormView({
  categoria,
  saving,
  error,
  onSave,
  onCancel,
}) {
  const isEditing = Boolean(categoria?.id);
  const [form, setForm] = useState(CATEGORIA_INITIAL_FORM);

  useEffect(() => {
    if (categoria) {
      setForm({
        codigo: categoria.codigo || '',
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        ubicacionDefault: categoria.ubicacionDefault || '',
        stockMinimoDefault: categoria.stockMinimoDefault ?? 5,
        activa: Boolean(categoria.activa),
      });
    } else {
      setForm(CATEGORIA_INITIAL_FORM);
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      stockMinimoDefault: Number(form.stockMinimoDefault) || 0,
    });
  };

  return (
    <div className="card" style={{ maxWidth: '720px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>
            {isEditing
              ? `Detalle y Edición de Categoría #${categoria.id}`
              : 'Alta de Nueva Categoría'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Configuración de rubro, ubicación sugerida en depósito y umbral mínimo de stock.
          </p>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
          ← Volver al listado
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isEditing && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <strong>ID Sistema:</strong> #{categoria.id}
          </div>
          <div>
            <strong>Productos Asociados:</strong> {categoria.cantidadProductos}
          </div>
          <div>
            <strong>Última Actualización:</strong>{' '}
            {categoria.updatedAt
              ? new Date(categoria.updatedAt).toLocaleDateString('es-AR')
              : 'N/A'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="form-group">
            <label htmlFor="form-cat-codigo">Código de Rubro *</label>
            <input
              id="form-cat-codigo"
              name="codigo"
              type="text"
              className="form-control"
              placeholder="Ej: CAT-011"
              value={form.codigo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-cat-nombre">Nombre de la Categoría *</label>
            <input
              id="form-cat-nombre"
              name="nombre"
              type="text"
              className="form-control"
              placeholder="Ej: Conectividad y Fibra"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="form-cat-desc">Descripción</label>
          <textarea
            id="form-cat-desc"
            name="descripcion"
            rows={3}
            className="form-control"
            placeholder="Detalle de los artículos agrupados en este rubro..."
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="form-group">
            <label htmlFor="form-cat-ubicacion">Ubicación por Defecto en Depósito</label>
            <input
              id="form-cat-ubicacion"
              name="ubicacionDefault"
              type="text"
              className="form-control"
              placeholder="Ej: Pasillo E - Estantería 2"
              value={form.ubicacionDefault}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-cat-stockmin">Stock Mínimo Sugerido (unidades)</label>
            <input
              id="form-cat-stockmin"
              name="stockMinimoDefault"
              type="number"
              min={0}
              className="form-control"
              value={form.stockMinimoDefault}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              name="activa"
              type="checkbox"
              checked={form.activa}
              onChange={handleChange}
            />
            <span>Categoría activa y habilitada para asociar productos</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? 'Guardando...'
              : isEditing
              ? 'Guardar Cambios'
              : 'Crear Categoría'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}