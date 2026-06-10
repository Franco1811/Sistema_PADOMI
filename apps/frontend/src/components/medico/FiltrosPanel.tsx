import { Search } from 'lucide-react';

interface FiltrosPanelProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  setPagina: (v: number) => void;
  filtroEstado: 'TODOS' | 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  setFiltroEstado: (v: 'TODOS' | 'CRITICO' | 'ADVERTENCIA' | 'NORMAL') => void;
  soloAlertasActivas: boolean;
  setSoloAlertasActivas: (v: boolean) => void;
  pacientesFiltradosLength: number;
  pacientesTotalLength: number;
}

export function FiltrosPanel({
  busqueda,
  setBusqueda,
  setPagina,
  filtroEstado,
  setFiltroEstado,
  soloAlertasActivas,
  setSoloAlertasActivas,
  pacientesFiltradosLength,
  pacientesTotalLength
}: FiltrosPanelProps) {
  return (
    <section className="controls-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, maxWidth: '480px' }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar paciente por nombre o DNI..."
            className="search-input"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          Pacientes filtrados en esta página: {pacientesFiltradosLength} de {pacientesTotalLength}
        </div>
      </div>

      <div className="filters-panel">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, marginRight: '0.5rem' }}>GRAVEDAD:</span>
        <button
          className={`filter-badge ${filtroEstado === 'TODOS' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('TODOS')}
        >
          Todos
        </button>
        <button
          className={`filter-badge critico ${filtroEstado === 'CRITICO' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('CRITICO')}
        >
          Crítico
        </button>
        <button
          className={`filter-badge advertencia ${filtroEstado === 'ADVERTENCIA' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('ADVERTENCIA')}
        >
          Advertencia
        </button>
        <button
          className={`filter-badge normal ${filtroEstado === 'NORMAL' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('NORMAL')}
        >
          Estable
        </button>

        <label className="checkbox-filter-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={soloAlertasActivas}
            onChange={(e) => {
              setSoloAlertasActivas(e.target.checked);
              setPagina(1);
            }}
            style={{ width: '15px', height: '15px', accentColor: 'var(--essalud-azul)', cursor: 'pointer' }}
          />
          Mostrar solo con alertas activas
        </label>
      </div>
    </section>
  );
}
