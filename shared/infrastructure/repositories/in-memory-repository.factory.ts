import { RepositoryFactory } from '../../domain/interface/repository-factory.interface';
import { 
  InMemoryUsuarioRepository, 
  InMemoryPacienteRepository, 
  InMemoryUmbralRepository, 
  InMemoryLecturaRepository, 
  InMemoryEvaluacionRepository, 
  InMemoryAlertaRepository, 
  InMemoryMetricaRepository,
  InMemoryDashboardRepository
} from './in-memory-repositories';

import { Rol } from '../../domain/entities/rol.entity';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Paciente } from '../../domain/entities/paciente.entity';
import { Metrica } from '../../domain/entities/metrica.entity';
import { Alerta } from '../../domain/entities/alerta.entity';
import { Especialidad } from '../../domain/entities/especialidad.entity';

export class InMemoryRepositoryFactory implements RepositoryFactory {
  private usuarioRepository = new InMemoryUsuarioRepository();
  private pacienteRepository = new InMemoryPacienteRepository();
  private umbralRepository = new InMemoryUmbralRepository();
  private lecturaRepository = new InMemoryLecturaRepository();
  private evaluacionRepository = new InMemoryEvaluacionRepository();
  private alertaRepository = new InMemoryAlertaRepository();
  private metricaRepository = new InMemoryMetricaRepository();
  private dashboardRepository = new InMemoryDashboardRepository(this.pacienteRepository, this.alertaRepository);

  constructor() {
    this.seedMockData();
  }

  private seedMockData() {
    try {
      // 0. Especialidades
      const geriatriaEsp = new Especialidad(1, 'Geriatría', 'Atención integral del adulto mayor en PADOMI');

      // 1. Roles y Permisos
      const adminRol = new Rol(1, 'ADMIN', ['GESTIONAR_PERSONAL', 'GESTIONAR_METRICAS', 'REGISTRAR_PACIENTE', 'GESTIONAR_PACIENTE']);
      const medicoRol = new Rol(2, 'MEDICO', ['VER_DASHBOARD', 'ATENDER_ALERTA', 'GESTIONAR_PACIENTE']);

      // 2. Usuarios (Utilizando hashes de bcrypt precalculados para evitar dependencias cruzadas en shared)
      const adminUser = new Usuario(
        'admin-uuid', 
        'USU-0001', 
        '00000000', 
        'Administrador', 
        'PADOMI', 
        'admin.padomi@essalud.gob.pe', 
        '$2b$10$hIr7kJrSfSlqrfqbdQfeMuwqCyHxowMAb1FgNE2FRkuTCadBWCOEu', 
        adminRol, 
        true
      );

      const medicoUser = new Usuario(
        'medico-carlos-uuid', 
        'USU-0002', 
        '11111111', 
        'Carlos', 
        'Mendoza', 
        'carlos.mendoza@essalud.gob.pe', 
        '$2b$10$Rf8N4ib5f4h/ekb78cXCWeVmOD8iMHmpehhFKy4ZdlMtaOXoi598i', 
        medicoRol, 
        true, 
        geriatriaEsp
      );

      this.usuarioRepository.guardar(adminUser);
      this.usuarioRepository.guardar(medicoUser);

      // 3. Métricas
      const fcMetrica = new Metrica('metrica-fc-uuid', 'MET-0001', 'Frecuencia Cardíaca', 'lpm', 'Sensor cardíaco de telemetría', 60, 100);
      const spo2Metrica = new Metrica('metrica-spo2-uuid', 'MET-0002', 'Saturación de Oxígeno', '%', 'Sensor de saturación infrarrojo', 90, 100);

      this.metricaRepository.guardar(fcMetrica);
      this.metricaRepository.guardar(spo2Metrica);

      // 4. Pacientes
      const pac1 = new Paciente('pac-1-uuid', 'PAC-1102', '42938102', 'María Alva Torres', 78, 'Insuficiencia Renal Crónica', 'medico-carlos-uuid', '992837463', 'Calle Las Camelias 432, San Isidro');
      const pac2 = new Paciente('pac-2-uuid', 'PAC-1103', '07283940', 'Juan Quispe Choque', 82, 'EPOC Severo', 'medico-carlos-uuid', '987123456', 'Av. Universitaria 1205, San Miguel');
      const pac3 = new Paciente('pac-3-uuid', 'PAC-1104', '72839401', 'Ana María Benítez', 74, 'Insuficiencia Respiratoria Crónica', 'medico-carlos-uuid', '992837482', 'Av. Salaverry 1420, Jesús María, Lima');

      this.pacienteRepository.guardar(pac1);
      this.pacienteRepository.guardar(pac2);
      this.pacienteRepository.guardar(pac3);

      // 5. Alertas
      const alerta1 = new Alerta('alerta-1-uuid', 'ALT-4029', 'pac-3-uuid', 'lectura-1-uuid', 'CRITICO', 'Saturación de oxígeno crítica (84%)', new Date(), false);
      this.alertaRepository.guardar(alerta1);

      console.log('Semillero de datos InMemory inicializado con éxito para modo offline.');
    } catch (err) {
      console.error('Error al inicializar semillero InMemory:', err);
    }
  }

  getUsuarioRepository() { return this.usuarioRepository; }
  getPacienteRepository() { return this.pacienteRepository; }
  getUmbralRepository() { return this.umbralRepository; }
  getLecturaRepository() { return this.lecturaRepository; }
  getEvaluacionRepository() { return this.evaluacionRepository; }
  getAlertaRepository() { return this.alertaRepository; }
  getMetricaRepository() { return this.metricaRepository; }
  getDashboardRepository() { return this.dashboardRepository; }

  public createRepository(type: 'usuario' | 'paciente' | 'umbral' | 'lectura' | 'evaluacion' | 'alerta' | 'metrica' | 'dashboard'): any {
    switch (type) {
      case 'usuario': return this.getUsuarioRepository();
      case 'paciente': return this.getPacienteRepository();
      case 'umbral': return this.getUmbralRepository();
      case 'lectura': return this.getLecturaRepository();
      case 'evaluacion': return this.getEvaluacionRepository();
      case 'alerta': return this.getAlertaRepository();
      case 'metrica': return this.getMetricaRepository();
      case 'dashboard': return this.getDashboardRepository();
      default:
        throw new Error(`Repositorio de tipo "${type}" no soportado en InMemory.`);
    }
  }
}
