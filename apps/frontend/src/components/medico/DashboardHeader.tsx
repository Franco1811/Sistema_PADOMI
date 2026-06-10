import { Power } from 'lucide-react';
import type { Usuario } from '../../services/auth.service';
import { LOGO_ESSALUD_URL } from '../../views/LoginView';

interface DashboardHeaderProps {
  usuario: Usuario;
  isConnected: boolean;
  totalPacientes: number;
  alertasCriticas: number;
  onLogout: () => void;
}

export function DashboardHeader({ usuario, isConnected, totalPacientes, alertasCriticas, onLogout }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={LOGO_ESSALUD_URL} alt="EsSalud Logo" className="dashboard-logo-essalud" />
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            PADOMI Telemetría
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem' }}>
            Médico Clínico: <strong>Dr. {usuario.nombre} {usuario.apellido}</strong> (Cód: <strong>{usuario.codigo}</strong>) | Especialidad: <strong>{usuario.especialidad || 'No especificada'}</strong>
          </p>
        </div>
      </div>
      <div className="header-user-section" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.3)', fontWeight: 600 }}>
            Pacientes: <span>{totalPacientes}</span>
          </div>
          <div style={{ 
            background: alertasCriticas > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(156, 163, 175, 0.1)', 
            color: alertasCriticas > 0 ? '#ef4444' : 'var(--text-secondary)',
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            border: alertasCriticas > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(156, 163, 175, 0.2)',
            fontWeight: 600
          }}>
            Alertas Críticas Hoy: <span>{alertasCriticas}</span>
          </div>
        </div>
        <div className="connection-badge">
          <span className={`connection-dot ${!isConnected ? 'disconnected' : ''}`} />
          {isConnected ? 'Monitoreo en Vivo Conectado' : 'Conectando canal...'}
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <Power size={14} /> Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
