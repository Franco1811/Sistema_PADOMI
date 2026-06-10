import { ShieldAlert } from 'lucide-react';

interface PacienteCardProps {
  p: {
    paciente: {
      id: string;
      dni: string;
      codigo: string;
      nombres: string;
      edad: number;
      diagnostico: string;
    };
    estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
    alertasActivas: number;
  };
  onClick: () => void;
}

export function PacienteCard({ p, onClick }: PacienteCardProps) {
  const severityClass = p.estado === 'CRITICO' ? 'critico' : p.estado === 'ADVERTENCIA' ? 'advertencia' : 'normal';
  const badgeLabel = p.estado === 'CRITICO' ? 'CRÍTICO' : p.estado === 'ADVERTENCIA' ? 'ADVERTENCIA' : 'NORMAL';

  return (
    <div
      className={`patient-card ${severityClass}`}
      onClick={onClick}
    >
      <div className="patient-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{p.paciente.nombres}</h3>
        <span className={`severity-badge ${severityClass}`} style={{ flexShrink: 0 }}>{badgeLabel}</span>
      </div>

      <div className="patient-meta-wrapper" style={{ marginTop: '0.75rem', flex: 1 }}>
        <div className="meta-top-info">
          <span>DNI: <strong>{p.paciente.dni}</strong></span>
          <span>Cód: <strong>{p.paciente.codigo}</strong></span>
          <span>Edad: <strong>{p.paciente.edad} años</strong></span>
        </div>

        <div className="meta-diag-section">
          <span className="meta-diag-title">Diagnóstico Clínico</span>
          <p className="meta-diag-value">
            {p.paciente.diagnostico}
          </p>
        </div>
      </div>

      <div className="patient-card-footer" style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="alert-count-indicator" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: p.alertasActivas > 0 ? 'var(--critico-color)' : 'var(--text-secondary)' }}>
          <ShieldAlert size={14} /> {p.alertasActivas} Alertas activas
        </span>
        <span className="click-action" style={{ fontSize: '0.78rem', color: 'var(--essalud-azul)', fontWeight: 600, opacity: 1, transform: 'none' }}>
          Ver Monitoreo →
        </span>
      </div>
    </div>
  );
}
