import * as dotenv from 'dotenv';
import * as path from 'path';
// Configurar para usar el .env de la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import http from 'http';
import app from './app';
import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { DashboardController } from './modules/CU06_MonitorearDashboard/presentation/dashboard.controller';
import { UsuarioModel } from '../../../shared/infrastructure/models/usuario.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    // 1. Inicializar la base de datos
    console.log('Conectando a la base de datos...');
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos exitosa.');

    // Crea administrador por defecto si no existe ninguno
    const usuarioRepository = AppDataSource.getRepository(UsuarioModel);
    const countAdmins = await usuarioRepository.count({ where: { rol: 'ADMINISTRATIVO' } });
    if (countAdmins === 0) {
      console.log('Sembrando administrador por defecto...');
      const adminPasswordHash = await bcrypt.hash('admin_secreto', 10);
      const defaultAdmin = new UsuarioModel();
      defaultAdmin.id = crypto.randomUUID();
      defaultAdmin.codigo = 'USU-0001';
      defaultAdmin.dni = '00000001';
      defaultAdmin.nombre = 'Admin';
      defaultAdmin.apellido = 'General';
      defaultAdmin.email = 'admin.padomi@padomi.pe';
      defaultAdmin.passwordHash = adminPasswordHash;
      defaultAdmin.rol = 'ADMINISTRATIVO';
      defaultAdmin.activo = true;
      defaultAdmin.especialidad = null;
      await usuarioRepository.save(defaultAdmin);
      console.log('Administrador por defecto creado exitosamente.');
    }

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
