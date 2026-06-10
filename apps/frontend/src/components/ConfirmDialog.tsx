import { ShieldAlert } from 'lucide-react';

interface ConfirmDialogProps {
  visible: boolean;
  titulo: string;
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, titulo, mensaje, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!visible) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000, padding: '1rem', animation: 'fade-in 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--modal-bg, #1e293b)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 24px 48px -8px rgba(0, 0, 0, 0.5)',
          animation: 'slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Icono */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldAlert size={26} style={{ color: 'var(--advertencia-color)' }} />
          </div>
        </div>

        {/* Título */}
        <h3 style={{
          margin: '0 0 0.75rem 0',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          {titulo}
        </h3>

        {/* Mensaje */}
        <p style={{
          margin: '0 0 1.75rem 0',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          {mensaje}
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.7rem', border: '1px solid var(--border-color)',
              background: 'transparent', color: 'var(--text-secondary)',
              borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onCancel();
              onConfirm();
            }}
            style={{
              flex: 1, padding: '0.7rem', border: 'none',
              background: 'var(--essalud-azul)', color: '#fff',
              borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0, 80, 154, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
