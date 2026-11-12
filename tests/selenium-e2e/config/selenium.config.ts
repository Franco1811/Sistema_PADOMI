/**
 * Configuración centralizada para la Suite E2E con Selenium WebDriver
 * Proyecto: Sistema de Telemetría y Gestión de Alertas (PADOMI - EsSalud)
 */
export const SELENIUM_CONFIG = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3000/api',

  // Pausas visuales (ms) para que la ejecución sea apreciable en la sustentación y video
  STEP_DELAY_MS: 900,
  MODAL_OBSERVE_MS: 1600,
  TIMEOUT_EXPLICITO_MS: 15000,

  CREDENCIALES: {
    ADMIN: {
      email: 'admin.padomi@essalud.gob.pe',
      password: 'admin_secreto'
    },
    MEDICO: {
      email: 'carlos.mendoza@essalud.gob.pe',
      password: 'carlos_secreto'
    }
  }
};

export const pausaVisual = (ms: number = SELENIUM_CONFIG.STEP_DELAY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

