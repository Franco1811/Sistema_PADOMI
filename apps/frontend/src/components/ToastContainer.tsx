import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  titulo: string;
  mensaje: string;
  severidad: 'CRITICO' | 'ADVERTENCIA' | 'INFO' | 'EXITO';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="toasts-container" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px', width: '100%' }}>
      {toasts.map((t) => {
        let icon = <ShieldAlert className="heartbeat-icon" size={20} style={{ color: 'var(--critico-color)' }} />;
        let titleColor = 'var(--critico-color)';
        let prefix = 'ALERTA CRÍTICA';
        let borderStyle = '1px solid rgba(239, 68, 68, 0.2)';

        if (t.severidad === 'ADVERTENCIA') {
          icon = <AlertTriangle className="bounce-icon" size={20} style={{ color: 'var(--advertencia-color)' }} />;
          titleColor = 'var(--advertencia-color)';
          prefix = 'ADVERTENCIA';
          borderStyle = '1px solid rgba(245, 158, 11, 0.2)';
        } else if (t.severidad === 'INFO' || t.severidad === 'EXITO') {
          icon = <CheckCircle2 size={20} style={{ color: 'var(--normal-color)' }} />;
          titleColor = 'var(--normal-color)';
          prefix = 'SISTEMA';
          borderStyle = '1px solid rgba(16, 185, 129, 0.2)';
        }

        return (
          <div 
            key={t.id} 
            className="toast-message" 
            style={{ 
              border: borderStyle, 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start',
              background: 'var(--card-bg)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {icon}
            <div style={{ flex: 1 }}>
              <strong style={{ color: titleColor, display: 'block', fontSize: '0.9rem' }}>
                {prefix}: {t.titulo}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t.mensaje}</span>
            </div>
            <button 
              className="toast-close-btn" 
              onClick={() => removeToast(t.id)} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
