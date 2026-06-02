import * as dotenv from 'dotenv';
import * as path from 'path';
// Configurar para usar el .env de la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import http from 'http';
import app from './app';
import { DatabaseConnection } from '../../../shared/infrastructure/data-source';
import { DashboardController } from './modules/CU06_MonitorearDashboard/presentation/dashboard.controller';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // 1. Inicializar la base de datos a través de la instancia del Singleton
    console.log('Conectando a la base de datos...');
    await DatabaseConnection.getInstance().initialize();
    console.log('Conexión a la base de datos exitosa.');

    // 2. Crear servidor HTTP
    const server = http.createServer(app);

    // 3. Inicializar WebSockets
    console.log('Inicializando WebSockets para el Dashboard...');
    DashboardController.initWebSocket(server);

    // 4. Levantar el servidor
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`Servidor Telemetría PADOMI en ejecución:`);
      console.log(`URL HTTP: http://localhost:${PORT}`);
      console.log(`WebSocket: ws://localhost:${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
      console.log(`=========================================`);
    });

  } catch (error) {
    console.error('Error crítico al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
bootstrap();
