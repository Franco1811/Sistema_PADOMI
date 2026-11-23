import { useState, useEffect } from 'react';
import { Mail, Lock, AlertTriangle, Info } from 'lucide-react';
import { AuthService } from '../services/auth.service';
import type { Usuario } from '../services/auth.service';

// 1. Importar el hook de accesibilidad
import { useAccessibility } from '../accessibility/AccessibilityContext';

import essaludLogo from '../assets/essalud-logo.png';

// ============================================================================
// CONFIGURACIÓN DEL LOGO DE ESSALUD:
// ============================================================================
export const LOGO_ESSALUD_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Logo_EsSalud.png';

interface LoginViewProps {
  onLoginSuccess: (token: string, usuario: Usuario) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  // 2. Extraer la función de lectura de texto
  const { speakText } = useAccessibility();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);

  // Manejo de atajos de teclado (Tecla Escape para cerrar el modal de recuperación)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speakText("Cerrando ventana de recuperación");
        setShowRecoverModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speakText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoadingLogin(true);

    try {
      const data = await AuthService.login(emailInput, passwordInput);
      onLoginSuccess(data.token, data.usuario);
    } catch (err: any) {
      setLoginError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Lado del Formulario (Izquierdo) */}
      <div className="login-form-side">
        <div className="login-box">
          <div className="login-logos">
            {/* Logo Oficial EsSalud */}
            <img
              src={LOGO_ESSALUD_URL}
              alt="EsSalud"
              className="login-logo-essalud"
              onClick={() => speakText("Institución EsSalud, Atención Domiciliaria PADOMI")}
            />

            <div className="login-brand-text">
              <span className="login-brand-subtitle" onClick={(e) => speakText(e.currentTarget.innerText)}>
                ATENCION DOMICILIARIA
              </span>
              <h1 className="login-brand-title" onClick={(e) => speakText(e.currentTarget.innerText)}>
                PADOMI
              </h1>
              <p className="login-brand-description" onClick={(e) => speakText(e.currentTarget.innerText)}>
                Módulo de Gestión y Monitoreo de Pacientes Crónicos
              </p>
            </div>
          </div>

          {loginError && (
            <div 
              className="alert-item-row critico" 
              style={{ padding: '0.85rem 1rem', borderRadius: '12px' }}
              onClick={() => speakText(`Error de acceso: ${loginError}`)}
            >
              <AlertTriangle size={18} style={{ color: 'var(--critico-color)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{loginError}</span>
            </div>
          )}

          <form className="login-fields" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="login-email" onClick={(e) => speakText(e.currentTarget.innerText)}>
                Correo Electrónico Institucional
              </label>
              <div className="login-input-wrapper" onClick={() => speakText("Campo de entrada para correo electrónico institucional del tipo essalud punto gob punto pe")}>
                <Mail className="login-input-icon" size={18} />
                <input
                  type="email"
                  id="login-email"
                  required
                  className="login-input"
                  placeholder="usuario@essalud.gob.pe"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            <div className="login-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-pass" onClick={(e) => speakText(e.currentTarget.innerText)}>
                  Contraseña
                </label>
                <button
                  type="button"
                  className="login-action-link"
                  onClick={() => {
                    speakText("¿Olvidó su contraseña?");
                    setShowRecoverModal(true);
                  }}
                  style={{ background: 'none', border: 'none', font: 'inherit', padding: 0 }}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <div className="login-input-wrapper" onClick={() => speakText("Campo de entrada para contraseña de acceso")}>
                <Lock className="login-input-icon" size={18} />
                <input
                  type="password"
                  id="login-pass"
                  required
                  className="login-input"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-btn-submit"
              disabled={loadingLogin}
              onClick={() => speakText(loadingLogin ? 'Validando credenciales' : 'Iniciar Sesión')}
            >
              {loadingLogin ? 'Validando credenciales...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>

      {/* Lado del Banner (Derecho) */}
      <div className="login-banner-side">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
          alt="Telemonitoreo PADOMI"
          className="login-banner-fullscreen-image"
        />
        <div className="login-banner-overlay-gradient"></div>
        <div 
          className="login-banner-content-overlay"
          onClick={() => speakText("Monitoreo Continuo 24/7. El sistema de telemetría PADOMI procesa señales biométricas en tiempo real.")}
        >
          <h3>Monitoreo Continuo 24/7</h3>
          <p>El sistema de telemetría PADOMI procesa señales biométricas en tiempo real, facilitando la intervención oportuna en emergencias críticas.</p>
        </div>
      </div>

      {/* Modal de Olvidó Contraseña */}
      {showRecoverModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-header" onClick={() => speakText("Restablecer contraseña")}>
              <Info size={36} style={{ color: 'var(--essalud-azul)' }} />
              <h2>RESTABLECER CONTRASEÑA</h2>
            </div>
            <div className="login-modal-body">
              <p 
                className="login-modal-text"
                onClick={(e) => speakText(e.currentTarget.innerText)}
              >
                Por políticas de seguridad del sector salud de <strong>EsSalud</strong>, los médicos clínicos y el personal asistencial no pueden restablecer sus credenciales de forma autónoma.
              </p>
              <div 
                className="login-modal-alert"
                onClick={(e) => speakText(e.currentTarget.innerText)}
              >
                Deberá comunicarse con el <strong>Administrador del Sistema PADOMI</strong> o enviar un ticket a soporte institucional para solicitar la regeneración de su contraseña provisional.
              </div>
              <button
                className="login-modal-btn"
                onClick={() => {
                  speakText("Entendido");
                  setShowRecoverModal(false);
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}