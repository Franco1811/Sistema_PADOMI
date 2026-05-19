import express, { Application } from 'express';
import cors from 'cors';

// CU-02 Gestionar Personal
import personalRoutes from './modules/CU02_GestionarPersonal/presentation/personal.routes';

// CU-03 Gestionar Métricas
import metricaRoutes from './modules/CU03_GestionarMetricas/presentation/catalogo.routes';

// CU-04 Registro Paciente
import registroPacienteRoutes from './modules/CU04_RegistroPaciente/presentation/registro-paciente.routes';

// CU-05 Gestionar Perfil
import perfilRoutes from './modules/CU05_GestionarPaciente/presentation/gestionar-perfil.routes';

// CU-06 Monitorear Dashboard
import dashboardRoutes from './modules/CU06_MonitorearDashboard/presentation/dashboard.routes';

// CU-07 Atender Emergencia
import atencionRoutes from './modules/CU07_AtenderEmergencia/presentation/atencion.routes';

// CU-08 Ingestar Datos
import ingestaRoutes from './modules/CU08_IngestarDatos/presentation/ingesta.routes';

const app: Application = express();

// Middlewares Globales
app.use(cors()); // Permite peticiones cruzadas (frontend)
app.use(express.json()); // Parsea body a JSON

// Montaje de Rutas
app.use('/api/personal', personalRoutes);
app.use('/api/metricas', metricaRoutes);
app.use('/api/pacientes/registro', registroPacienteRoutes);
app.use('/api/pacientes/perfil', perfilRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alertas', atencionRoutes);
app.use('/api/ingesta', ingestaRoutes);

// Endpoint de prueba (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor Telemetría PADOMI funcionando.' });
});

export default app;
