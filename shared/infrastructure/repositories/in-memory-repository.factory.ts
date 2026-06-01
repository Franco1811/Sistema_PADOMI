import { RepositoryFactory } from '../../domain/interface/repository-factory.interface';
import { 
  InMemoryUsuarioRepository, 
  InMemoryPacienteRepository, 
  InMemoryUmbralRepository, 
  InMemoryLecturaRepository, 
  InMemoryEvaluacionRepository, 
  InMemoryAlertaRepository, 
  InMemoryMetricaRepository 
} from './in-memory-repositories';

export class InMemoryRepositoryFactory implements RepositoryFactory {
  private usuarioRepository = new InMemoryUsuarioRepository();
  private pacienteRepository = new InMemoryPacienteRepository();
  private umbralRepository = new InMemoryUmbralRepository();
  private lecturaRepository = new InMemoryLecturaRepository();
  private evaluacionRepository = new InMemoryEvaluacionRepository();
  private alertaRepository = new InMemoryAlertaRepository();
  private metricaRepository = new InMemoryMetricaRepository();

  getUsuarioRepository() { return this.usuarioRepository; }
  getPacienteRepository() { return this.pacienteRepository; }
  getUmbralRepository() { return this.umbralRepository; }
  getLecturaRepository() { return this.lecturaRepository; }
  getEvaluacionRepository() { return this.evaluacionRepository; }
  getAlertaRepository() { return this.alertaRepository; }
  getMetricaRepository() { return this.metricaRepository; }

  public createRepository(type: 'usuario' | 'paciente' | 'umbral' | 'lectura' | 'evaluacion' | 'alerta' | 'metrica'): any {
    switch (type) {
      case 'usuario': return this.getUsuarioRepository();
      case 'paciente': return this.getPacienteRepository();
      case 'umbral': return this.getUmbralRepository();
      case 'lectura': return this.getLecturaRepository();
      case 'evaluacion': return this.getEvaluacionRepository();
      case 'alerta': return this.getAlertaRepository();
      case 'metrica': return this.getMetricaRepository();
      default:
        throw new Error(`Repositorio de tipo "${type}" no soportado en InMemory.`);
    }
  }
}
