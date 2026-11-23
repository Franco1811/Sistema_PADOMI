import { useState, useEffect } from 'react';
import { AuthService } from './services/auth.service';
import type { Usuario } from './services/auth.service';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/ToastContainer';
import type { ToastItem } from './components/ToastContainer';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';
import { MedicoView } from './views/MedicoView';

// Importar el proveedor, la barra flotante y los atajos de accesibilidad
import { AccessibilityProvider } from './accessibility/AccessibilityContext';
import { AccessibilityToolbar } from './accessibility/AccessibilityToolbar';
import { AccessibilityShortcuts } from './accessibility/AccessibilityShortcuts';

export default function App() {
  const [token, setToken] = useState<string | null>(AuthService.getToken());
  const [usuario, setUsuario] = useState<Usuario | null>(AuthService.getCurrentUser());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('padomi_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('padomi_theme', theme);
  }, [theme]);

  // Atajos de teclado accesibles (ODS 10 / WCAG)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Si presionan Alt + A, muestra un aviso de accesibilidad
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        addToast('Accesibilidad', 'Atajo de teclado Alt + A activado correctamente.', 'INFO');
      }
      
      // Si presionan la tecla Escape, simula el cierre de elementos flotantes
      if (e.key === 'Escape') {
        addToast('Navegación', 'Tecla Escape presionada: Limpiando vistas o modales.', 'INFO');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const addToast = (titulo: string, mensaje: string, severidad: 'CRITICO' | 'ADVERTENCIA' | 'INFO' | 'EXITO') => {
    const nuevoToast: ToastItem = {
      id: Math.random().toString(),
      titulo,
      mensaje,
      severidad
    };
    setToasts(prev => [nuevoToast, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLoginSuccess = (newToken: string, nuevoUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(nuevoUsuario);
    setToasts([]);
    addToast('Acceso Exitoso', `Sesión iniciada como ${nuevoUsuario.rol.nombre}: ${nuevoUsuario.nombre}`, 'EXITO');
  };

  const handleLogout = () => {
    AuthService.logout();
    setToken(null);
    setUsuario(null);
    setToasts([]);
  };

  return (
    <AccessibilityProvider>
      {/* Componente global para escuchar los atajos de teclado de accesibilidad (Ctrl + Shift + S / R) */}
      <AccessibilityShortcuts />

      <div className="app-wrapper">
        <ThemeToggle theme={theme} setTheme={setTheme} />

        {!token || !usuario ? (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        ) : usuario.rol.nombre === 'ADMIN' ? (
          <AdminView usuario={usuario} token={token} onLogout={handleLogout} />
        ) : (
          <MedicoView 
            usuario={usuario} 
            token={token} 
            onLogout={handleLogout} 
            addToast={addToast} 
          />
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <AccessibilityToolbar />
      </div>
    </AccessibilityProvider>
  );
}