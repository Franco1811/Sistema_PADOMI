import { useState, useEffect } from 'react';
import { AuthService } from './services/auth.service';
import type { Usuario } from './services/auth.service';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/ToastContainer';
import type { ToastItem } from './components/ToastContainer';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';
import { MedicoView } from './views/MedicoView';

export default function App() {
  // Estados de Autenticación
  const [token, setToken] = useState<string | null>(AuthService.getToken());
  const [usuario, setUsuario] = useState<Usuario | null>(AuthService.getCurrentUser());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Estado de Tema Claro / Oscuro
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('padomi_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('padomi_theme', theme);
  }, [theme]);

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
    // Limpiar toasts anteriores para evitar duplicados en la interfaz
    setToasts([]);
    // Disparar toast de bienvenida con el tipo EXITO
    addToast('Acceso Exitoso', `Sesión iniciada como ${nuevoUsuario.rol.nombre}: ${nuevoUsuario.nombre}`, 'EXITO');
  };

  const handleLogout = () => {
    AuthService.logout();
    setToken(null);
    setUsuario(null);
    setToasts([]); // Limpiar los toasts en logout
  };

  // Renderizado principal según el estado de sesión y rol
  return (
    <div className="app-wrapper">
      {/* Botón flotante para alternar entre Modo Claro y Modo Oscuro */}
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

      {/* Notificaciones flotantes en tiempo real */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
