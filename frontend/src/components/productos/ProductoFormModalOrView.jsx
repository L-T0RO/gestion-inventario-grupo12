import { useState, useEffect } from 'react';

const INITIAL_FORM = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoriaId: 1,
  ubicacion: "",
  stockActual: 0,
  stockMinimo: 0,
  precioUnitario: 0,
};

export function ProductoFormModalOrView({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        codigo: initialData.codigo ?? "",
        nombre: initialData.nombre ?? "",
        descripcion: initialData.descripcion ?? "",
        categoriaId: initialData.categoriaId ?? 1,
        ubicacion: initialData.ubicacion ?? "",
        stockActual: initialData.stockActual ?? 0,
        stockMinimo: initialData.stockMinimo ?? 0,
        precioUnitario: initialData.precioUnitario ?? 0,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
      <h3>{initialData ? `Editar Producto #${initialData.id}` : "Nuevo Producto"}</h3>

      <div>
        <label>Código: </label>
        <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="PROD-004" />
      </div>

      <div>
        <label>Nombre*: </label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>

      <div>
        <label>Descripción: </label>
        <input name="descripcion" value={form.descripcion} onChange={handleChange} />
      </div>

      <div>
        <label>Categoría ID: </label>
        <input type="number" name="categoriaId" value={form.categoriaId} onChange={handleChange} min="1" />
      </div>

      <div>
        <label>Ubicación: </label>
        <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Estante A3" />
      </div>

      <div>
        <label>Stock Actual: </label>
        <input type="number" name="stockActual" value={form.stockActual} onChange={handleChange} min="0" />
      </div>

      <div>
        <label>Stock Mínimo: </label>
        <input type="number" name="stockMinimo" value={form.stockMinimo} onChange={handleChange} min="0" />
      </div>

      <div>
        <label>Precio Unitario: </label>
        <input type="number" name="precioUnitario" value={form.precioUnitario} onChange={handleChange} min="0" />
      </div>

      <div style={{ marginTop: "12px" }}>
        <button type="submit">{initialData ? "Guardar Cambios" : "Crear Producto"}</button>{" "}
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}