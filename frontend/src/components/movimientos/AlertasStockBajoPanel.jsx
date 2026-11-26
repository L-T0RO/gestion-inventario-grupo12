export default function AlertasStockBajoPanel({ resumen }) {
if (!resumen) return null;

const {
    totalMovimientos = 0,
    totalIngresos = 0,
    totalEgresos = 0,
    valorizacionTotal = 0,
    alertasStockBajo = [],
} = resumen;

return (
    <section className="alertas-stock-panel">
    <div className="resumen-metricas">
        <div>
        <strong>Total movimientos:</strong> {totalMovimientos}
        </div>
        <div>
        <strong>Ingresos acumulados:</strong> {totalIngresos}
        </div>
        <div>
        <strong>Egresos acumulados:</strong> {totalEgresos}
        </div>
        <div>
        <strong>Valorización estimada:</strong> ${valorizacionTotal.toLocaleString('es-AR')}
        </div>
    </div>

    <div className="alertas-lista">
        <h3>Alertas de stock bajo ({alertasStockBajo.length})</h3>
        {alertasStockBajo.length === 0 ? (
        <p>No hay productos por debajo del stock mínimo.</p>
        ) : (
        <ul>
            {alertasStockBajo.map((item) => (
            <li key={item.productoId}>
                <strong>{item.productoNombre}</strong> — Stock actual: {item.stockActual} (Mínimo: {item.stockMinimo})
            </li>
            ))}
        </ul>
        )}
    </div>
    </section>
);
}