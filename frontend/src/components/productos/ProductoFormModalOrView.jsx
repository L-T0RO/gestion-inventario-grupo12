import { useState, useEffect } from "react";
import "../../styles/ProductoFormModalOrView.css";

const INITIAL_FORM = {
  codigo: "",
  nombre: "",
  descripcion: "",
  categoriaId: 1,
  ubicacion: "",
  stockActual: 1,
  stockMinimo: 0,
  precioUnitario: 0,
};

const MAX_LENGTHS = {
  codigo: 30,
  nombre: 120,
  descripcion: 500,
  ubicacion: 80,
};

const CODE_REGEX = /^[A-Za-z0-9_-]{2,30}$/;

function toSafeNumber(value, fallback = 0, { min = 0, integer = false } = {}) {
  const num = typeof value === "number" ? value : Number(String(value ?? "").trim());
  if (!Number.isFinite(num) || num < min) return fallback;
  return integer ? Math.trunc(num) : num;
}

export function ProductoFormModalOrView({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setValidationError("");
    if (initialData) {
      setForm({
        codigo: String(initialData.codigo ?? "").slice(0, MAX_LENGTHS.codigo),
        nombre: String(initialData.nombre ?? "").slice(0, MAX_LENGTHS.nombre),
        descripcion: String(initialData.descripcion ?? "").slice(0, MAX_LENGTHS.descripcion),
        categoriaId: toSafeNumber(initialData.categoriaId, 1, { min: 1, integer: true }),
        ubicacion: String(initialData.ubicacion ?? "").slice(0, MAX_LENGTHS.ubicacion),
        stockActual: toSafeNumber(initialData.stockActual, 1, { min: 1, integer: true }),
        stockMinimo: toSafeNumber(initialData.stockMinimo, 0, { min: 0, integer: true }),
        precioUnitario: toSafeNumber(initialData.precioUnitario, 0, { min: 0, integer: false }),
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValidationError("");

    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    const maxLen = MAX_LENGTHS[name];
    const nextValue = typeof maxLen === "number" ? value.slice(0, maxLen) : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const codigoTrimmed = String(form.codigo ?? "").trim();
    const nombreTrimmed = String(form.nombre ?? "").trim();
    const descripcionTrimmed = String(form.descripcion ?? "").trim();
    const ubicacionTrimmed = String(form.ubicacion ?? "").trim();

    if (!codigoTrimmed) {
      setValidationError("El código del producto es obligatorio.");
      return;
    }

    if (!CODE_REGEX.test(codigoTrimmed)) {
      setValidationError(
        "El código debe tener entre 2 y 30 caracteres (letras, números, '-' o '_')."
      );
      return;
    }

    if (!nombreTrimmed) {
      setValidationError("El nombre del producto es obligatorio.");
      return;
    }

    if (nombreTrimmed.length < 2 || nombreTrimmed.length > MAX_LENGTHS.nombre) {
      setValidationError(
        `El nombre debe tener entre 2 y ${MAX_LENGTHS.nombre} caracteres.`
      );
      return;
    }

    if (!ubicacionTrimmed) {
      setValidationError("La ubicación en depósito es obligatoria.");
      return;
    }

    if (ubicacionTrimmed.length < 2 || ubicacionTrimmed.length > MAX_LENGTHS.ubicacion) {
      setValidationError(
        `La ubicación debe tener entre 2 y ${MAX_LENGTHS.ubicacion} caracteres.`
      );
      return;
    }

    if (descripcionTrimmed.length > MAX_LENGTHS.descripcion) {
      setValidationError(
        `La descripción no puede superar los ${MAX_LENGTHS.descripcion} caracteres.`
      );
      return;
    }

    const categoriaIdNum = Number(form.categoriaId);
    if (!Number.isInteger(categoriaIdNum) || categoriaIdNum < 1) {
      setValidationError("La categoría ID debe ser un número entero mayor o igual a 1.");
      return;
    }

    const stockActualNum = Number(form.stockActual);
    const stockMinimoNum = Number(form.stockMinimo);
    const precioUnitarioNum = Number(form.precioUnitario);

    if (form.stockActual === "" || !Number.isInteger(stockActualNum) || stockActualNum < 1) {
      setValidationError("El stock actual debe ser un número entero mayor o igual a 1.");
      return;
    }

    if (form.stockMinimo === "" || !Number.isInteger(stockMinimoNum) || stockMinimoNum < 0) {
      setValidationError("El stock mínimo debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (
      form.precioUnitario === "" ||
      !Number.isFinite(precioUnitarioNum) ||
      precioUnitarioNum <= 0
    ) {
      setValidationError("El precio unitario debe ser mayor a 0.");
      return;
    }

    onSubmit({
      codigo: codigoTrimmed,
      nombre: nombreTrimmed,
      descripcion: descripcionTrimmed,
      categoriaId: categoriaIdNum,
      ubicacion: ubicacionTrimmed,
      stockActual: stockActualNum,
      stockMinimo: stockMinimoNum,
      precioUnitario: precioUnitarioNum,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="prod-form-card" noValidate>
      <div className="prod-form-header">
        <h3 className="prod-form-title">
          {initialData ? `Editar Producto #${initialData.id}` : "Nuevo Producto"}
        </h3>
        <p className="prod-form-subtitle">
          {initialData
            ? "Modificá los datos del producto o sus niveles de stock."
            : "Completá los datos para registrar un nuevo producto en el inventario."}
        </p>
      </div>

      {validationError && (
        <div className="prod-status-banner" role="alert">
          {validationError}
        </div>
      )}

      <div className="prod-form-grid">
        <div className="prod-form-field">
          <label htmlFor="prod-codigo" className="prod-form-label">
            Código *
          </label>
          <input
            id="prod-codigo"
            className="prod-form-input"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.codigo}
            placeholder="PROD-004"
            required
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-nombre" className="prod-form-label">
            Nombre *
          </label>
          <input
            id="prod-nombre"
            className="prod-form-input"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.nombre}
            placeholder="Ej: Teclado Mecánico"
            required
          />
        </div>

        <div className="prod-form-field prod-form-field-full">
          <label htmlFor="prod-descripcion" className="prod-form-label">
            Descripción
          </label>
          <input
            id="prod-descripcion"
            className="prod-form-input"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.descripcion}
            placeholder="Detalle breve del producto"
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-categoriaId" className="prod-form-label">
            Categoría ID *
          </label>
          <input
            id="prod-categoriaId"
            className="prod-form-input"
            type="number"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-ubicacion" className="prod-form-label">
            Ubicación *
          </label>
          <input
            id="prod-ubicacion"
            className="prod-form-input"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            maxLength={MAX_LENGTHS.ubicacion}
            placeholder="Estante A3"
            required
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-stockActual" className="prod-form-label">
            Stock Actual *
          </label>
          <input
            id="prod-stockActual"
            className="prod-form-input"
            type="number"
            name="stockActual"
            value={form.stockActual}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-stockMinimo" className="prod-form-label">
            Stock Mínimo *
          </label>
          <input
            id="prod-stockMinimo"
            className="prod-form-input"
            type="number"
            name="stockMinimo"
            value={form.stockMinimo}
            onChange={handleChange}
            min="0"
            step="1"
            required
          />
        </div>

        <div className="prod-form-field">
          <label htmlFor="prod-precioUnitario" className="prod-form-label">
            Precio Unitario *
          </label>
          <input
            id="prod-precioUnitario"
            className="prod-form-input"
            type="number"
            name="precioUnitario"
            value={form.precioUnitario}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="prod-form-actions">
        <button type="submit" className="prod-form-btn-primary">
          {initialData ? "Guardar Cambios" : "Crear Producto"}
        </button>
        {onCancel && (
          <button type="button" className="prod-form-btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}