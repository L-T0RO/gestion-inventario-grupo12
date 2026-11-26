export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
        padding: '0.85rem 1.5rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <span>Sistema de Gestión de Inventario — Grupo 12</span>
      <span>Tecnicatura Universitaria en Programación • UTN FRBB</span>
    </footer>
  );
}