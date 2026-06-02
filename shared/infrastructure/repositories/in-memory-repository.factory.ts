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

export class InMemoryRepositoryFactory implements RepositoryFactory {
  private usuarioRepository = new InMemoryUsuarioRepository();
  private pacienteRepository = new InMemoryPacienteRepository();
  private umbralRepository = new InMemoryUmbralRepository();
  private lecturaRepository = new InMemoryLecturaRepository();
  private evaluacionRepository = new InMemoryEvaluacionRepository();
  private alertaRepository = new InMemoryAlertaRepository();
  private metricaRepository = new InMemoryMetricaRepository();
  private dashboardRepository = new InMemoryDashboardRepository(this.pacienteRepository, this.alertaRepository);

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
