import express, { Application } from 'express';
import cors from 'cors';
import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { EspecialidadModel } from '../../../shared/infrastructure/models/especialidad.model';
import { PacienteModel } from '../../../shared/infrastructure/models/paciente.model';
import { UsuarioModel } from '../../../shared/infrastructure/models/usuario.model';

// CU-01 Iniciar Sesión (Autenticación)
import authRoutes from './modules/CU01_auth/presentation/auth.routes';

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
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// Interceptor global de errores de sintaxis JSON
app.use((err: any, req: any, res: any, next: any): void => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Sintaxis JSON inválida: verifique comas, comillas o formato' });
    return;
  }
  next();
});

// ==================== ESPECIALIDADES ====================
app.get('/api/especialidades', async (req, res) => {
  try {
    const especialidadRepository = AppDataSource.getRepository(EspecialidadModel);
    const especialidades = await especialidadRepository.find({
      order: { nombre: 'ASC' }
    });
    res.json(especialidades);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/especialidades', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
    }
    
    const especialidadRepository = AppDataSource.getRepository(EspecialidadModel);
    
    const existe = await especialidadRepository.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({ error: `Ya existe una especialidad con el nombre "${nombre}"` });
    }
    
    const nueva = especialidadRepository.create({
      nombre: nombre.trim(),
      descripcion: descripcion || null
    });
    
    const resultado = await especialidadRepository.save(nueva);
    res.status(201).json(resultado);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== PACIENTES ====================
app.get('/api/pacientes', async (req, res) => {
  try {
    const pacienteRepository = AppDataSource.getRepository(PacienteModel);
    const pacientes = await pacienteRepository.find();
    
    const usuarioRepository = AppDataSource.getRepository(UsuarioModel);
    const medicos = await usuarioRepository.find({ where: { rolId: 2 } });
    
    const medicoMap = new Map();
    medicos.forEach((medico: any) => {
      medicoMap.set(medico.id, `${medico.nombre} ${medico.apellido}`);
    });
    
    const pacientesConMedico = pacientes.map((paciente: any) => ({
      id: paciente.id,
      codigo: paciente.codigo,
      dni: paciente.dni,
      nombres: paciente.nombres,
      edad: paciente.edad,
      diagnostico: paciente.diagnostico,
      medicoAsignadoId: paciente.medicoAsignadoId,
      telefono: paciente.telefono,
      direccion: paciente.direccion,
      medicoNombre: medicoMap.get(paciente.medicoAsignadoId) || 'No asignado'
    }));
    
    res.json(pacientesConMedico);
  } catch (error: any) {
    console.error('Error en GET /api/pacientes:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== RUTAS PRINCIPALES ====================
app.use('/api/auth', authRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/metricas', metricaRoutes);
app.use('/api/pacientes', registroPacienteRoutes);
app.use('/api/pacientes/perfil', perfilRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alertas', atencionRoutes);
app.use('/api/ingesta', ingestaRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor Telemetría PADOMI funcionando.' });
});

export default app;