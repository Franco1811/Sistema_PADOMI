import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <button 
      className="btn-theme-toggle-fixed" 
      onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {theme === 'dark' ? (
        <Sun size={20} style={{ color: '#fbbf24' }} />
      ) : (
        <Moon size={20} style={{ color: '#2563eb' }} />
      )}
    </button>
  );
}
