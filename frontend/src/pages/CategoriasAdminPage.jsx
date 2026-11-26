import { useCallback, useEffect, useState } from 'react';
import CategoriasList from '../components/categorias/CategoriasList';
import CategoriaFormView from '../components/categorias/CategoriaFormView';
import UsuariosPermisosPanel from '../components/categorias/UsuariosPermisosPanel';
import { categoriasService } from '../services/categorias.service';
import { CATEGORIA_ESTADOS } from '../types/categoria.types';

export default function CategoriasAdminPage({ currentUser }) {
  const [activeTab, setActiveTab] = useState('categorias');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    sortBy: 'id',
    order: 'asc',
    search: '',
    estado: CATEGORIA_ESTADOS.TODAS,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadCategorias = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await categoriasService.getAll(filters);
      setCategorias(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message || 'Error al cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handlePageChange = (nextPage) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const handleSelectCategoria = async (id) => {
    setFormError('');
    setFeedback('');
    try {
      const res = await categoriasService.getById(id);
      setSelectedCategoria(res.data);
      setViewMode('form');
    } catch (err) {
      setError(err.message || 'No se pudo obtener el detalle de la categoría.');
    }
  };

  const handleCreateNew = () => {
    setSelectedCategoria(null);
    setFormError('');
    setFeedback('');
    setViewMode('form');
  };

  const handleSaveCategoria = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      const res = selectedCategoria?.id
        ? await categoriasService.update(selectedCategoria.id, payload)
        : await categoriasService.create(payload);
      setFeedback(res.msg);
      setViewMode('list');
      setSelectedCategoria(null);
      await loadCategorias();
    } catch (err) {
      setFormError(err.message || 'Error al guardar la categoría.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategoria = async (cat) => {
    const confirmed = window.confirm(
      `¿Confirmás eliminar la categoría "${cat.nombre}" (${cat.codigo})?`
    );
    if (!confirmed) return;

    setError('');
    setFeedback('');
    try {
      const res = await categoriasService.remove(cat.id);
      setFeedback(res.msg);
      await loadCategorias();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la categoría.');
    }
  };

  const handleExport = async (format) => {
    try {
      await categoriasService.exportReport({ format, filters });
      setFeedback(`Reporte de categorías exportado en formato ${format.toUpperCase()}.`);
    } catch (err) {
      setError(err.message || 'Error al exportar el reporte.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Categorías y Administración</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestión de rubros del catálogo, configuración de depósito y permisos de usuarios.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'categorias' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => {
              setActiveTab('categorias');
              setViewMode('list');
            }}
          >
            Rubros y Categorías
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setActiveTab('admin')}
          >
            Administración y Usuarios
          </button>
        </div>
      </div>

      {feedback && <div className="alert alert-success">{feedback}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {activeTab === 'categorias' ? (
        viewMode === 'list' ? (
          <CategoriasList
            categorias={categorias}
            pagination={pagination}
            filters={filters}
            loading={loading}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onSelectCategoria={handleSelectCategoria}
            onDeleteCategoria={handleDeleteCategoria}
            onCreateNew={handleCreateNew}
            onExport={handleExport}
          />
        ) : (
          <CategoriaFormView
            categoria={selectedCategoria}
            saving={saving}
            error={formError}
            onSave={handleSaveCategoria}
            onCancel={() => {
              setViewMode('list');
              setSelectedCategoria(null);
            }}
          />
        )
      ) : (
        <UsuariosPermisosPanel currentUser={currentUser} />
      )}
    </div>
  );
}