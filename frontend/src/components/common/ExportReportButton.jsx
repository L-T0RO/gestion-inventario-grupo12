import { useState } from 'react';

export default function ExportReportButton({
filename = 'reporte-inventario',
title = 'Reporte del Sistema',
columns = [],
rows = [],
}) {
const [format, setFormat] = useState('xlsx');

const buildCsvContent = () => {
    const headers = columns.map((c) => `"${c.label}"`).join(';');
    const body = rows
    .map((row) =>
        columns
        .map((c) => {
            const raw = row[c.key] ?? '';
            return `"${String(raw).replace(/"/g, '""')}"`;
        })
        .join(';')
    )
    .join('\n');
    return `${headers}\n${body}`;
};

const triggerDownload = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const handleExport = () => {
    if (format === 'xlsx') {
    const csvContent = '\uFEFF' + buildCsvContent();
    triggerDownload(
        csvContent,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
        'xlsx'
    );
    return;
    }

    const lines = [
    title.toUpperCase(),
    `Fecha de emisión: ${new Date().toLocaleString('es-AR')}`,
    `Total de registros: ${rows.length}`,
    '------------------------------------------------------------',
    ...rows.map((row, idx) => {
        const detalle = columns
        .map((c) => `${c.label}: ${row[c.key] ?? '-'}`)
        .join(' | ');
        return `${idx + 1}. ${detalle}`;
    }),
    ].join('\n');

    triggerDownload(lines, 'application/pdf', 'pdf');
};

return (
    <div className="export-report-control">
    <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="xlsx">Excel (.xlsx)</option>
        <option value="pdf">PDF (.pdf)</option>
    </select>
    <button type="button" onClick={handleExport}>
        Exportar reporte
    </button>
    </div>
);
}