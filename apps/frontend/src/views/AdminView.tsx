import { Settings, ChevronLeft } from 'lucide-react';
import type { Usuario } from '../services/auth.service';
import { LOGO_ESSALUD_URL } from './LoginView';

interface AdminViewProps {
  usuario: Usuario;
  onLogout: () => void;
}

export function AdminView({ usuario, onLogout }: AdminViewProps) {
  return (
    <div className="login-split-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="login-box" style={{ maxWidth: '500px', width: '100%', padding: '3rem', borderRadius: '24px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <div className="login-logos" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Logo Oficial EsSalud (Familia de 4 integrantes) */}
          {/* Logo Oficial EsSalud */}
          <img 
            src={LOGO_ESSALUD_URL} 
            alt="EsSalud" 
            className="login-logo-essalud" 
          />
          
          <div className="login-brand-text">
            <span className="login-brand-subtitle">ATENCION DOMICILIARIA</span>
            <h1 className="login-brand-title" style={{ fontSize: '2.5rem' }}>PADOMI</h1>
            <p className="login-brand-description">Módulo de Administración del Sistema</p>
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'center' }}>
          <Settings size={48} className="heartbeat-icon" style={{ color: 'var(--accent-color)', marginBottom: '1rem', marginInline: 'auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Módulo en Proceso</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            La interfaz de administración para la gestión de cuentas de personal y catálogo de métricas clínicas se encuentra actualmente en proceso de integración.
          </p>
        </div>

        <button className="admin-btn" style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={onLogout}>
          <ChevronLeft size={20} /> Retroceder / Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
