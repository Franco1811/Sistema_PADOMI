import { X, AlertTriangle } from 'lucide-react';

interface ConfirmarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmarModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Eliminar', 
  cancelText = 'Cancelar',
  type = 'danger' 
}: ConfirmarModalProps) {
  
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'rgba(239, 68, 68, 0.15)',
          iconColor: '#ef4444',
          buttonBg: '#ef4444',
          buttonHover: '#dc2626'
        };
      case 'warning':
        return {
          iconBg: 'rgba(245, 158, 11, 0.15)',
          iconColor: '#f59e0b',
          buttonBg: '#f59e0b',
          buttonHover: '#d97706'
        };
      case 'info':
        return {
          iconBg: 'rgba(59, 130, 246, 0.15)',
          iconColor: '#3b82f6',
          buttonBg: '#3b82f6',
          buttonHover: '#2563eb'
        };
      default:
        return {
          iconBg: 'rgba(239, 68, 68, 0.15)',
          iconColor: '#ef4444',
          buttonBg: '#ef4444',
          buttonHover: '#dc2626'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="confirmar-overlay" onClick={onClose}>
      <div className="confirmar-container" onClick={(e) => e.stopPropagation()}>
        <button className="confirmar-close" onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className="confirmar-icon" style={{ background: styles.iconBg }}>
          <AlertTriangle size={28} style={{ color: styles.iconColor }} />
        </div>
        
        <h3 className="confirmar-title">{title}</h3>
        <p className="confirmar-message">{message}</p>
        
        <div className="confirmar-buttons">
          <button className="confirmar-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className="confirmar-confirm"
            style={{ background: styles.buttonBg }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = styles.buttonHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = styles.buttonBg;
            }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .confirmar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          animation: fadeIn 0.2s ease;
        }

        .confirmar-container {
          background: var(--card-bg);
          border-radius: 20px;
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          text-align: center;
          position: relative;
          animation: scaleIn 0.3s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* Modo claro */
        [data-theme="light"] .confirmar-container {
          background: #ffffff;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        [data-theme="light"] .confirmar-title {
          color: #1a1a2e;
        }

        [data-theme="light"] .confirmar-message {
          color: #4b5563;
        }

        [data-theme="light"] .confirmar-cancel {
          border-color: #e5e7eb;
          color: #6b7280;
        }

        [data-theme="light"] .confirmar-cancel:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        [data-theme="light"] .confirmar-close {
          color: #6b7280;
        }

        [data-theme="light"] .confirmar-close:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        /* Modo oscuro */
        [data-theme="dark"] .confirmar-container {
          background: #1e1e2e;
        }

        [data-theme="dark"] .confirmar-title {
          color: #ffffff;
        }

        [data-theme="dark"] .confirmar-message {
          color: #a0a0b0;
        }

        [data-theme="dark"] .confirmar-cancel {
          border-color: #4a4a5a;
          color: #a0a0b0;
        }

        [data-theme="dark"] .confirmar-cancel:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .confirmar-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }

        .confirmar-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }

        .confirmar-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .confirmar-message {
          margin: 0 0 1.5rem 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .confirmar-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .confirmar-cancel,
        .confirmar-confirm {
          padding: 0.6rem 1.5rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .confirmar-cancel {
          background: transparent;
          border: 1px solid;
        }

        .confirmar-confirm {
          color: white;
        }

        .confirmar-confirm:hover {
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}