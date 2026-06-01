import { RepositoryFactory } from '../../domain/interface/repository-factory.interface';
import { UsuarioRepository } from './usuario.repository';
import { PacienteRepository } from './paciente.repository';
import { UmbralRepository } from './umbral.repository';
import { LecturaRepository } from './lectura.repository';
import { EvaluacionRepository } from './evaluacion.repository';
import { AlertaRepository } from './alerta.repository';
import { MetricaRepository } from './metrica.repository';
import { InMemoryRepositoryFactory } from './in-memory-repository.factory';

/**
 * Fábrica Concreta (SqlRepositoryFactory)
 * Implementa la interfaz Abstract Factory para instanciar repositorios de base de datos SQL.
 */
export class SqlRepositoryFactory implements RepositoryFactory {
  getUsuarioRepository() { return new UsuarioRepository(); }
  getPacienteRepository() { return new PacienteRepository(); }
  getUmbralRepository() { return new UmbralRepository(); }
  getLecturaRepository() { return new LecturaRepository(); }
  getEvaluacionRepository() { return new EvaluacionRepository(); }
  getAlertaRepository() { return new AlertaRepository(); }
  getMetricaRepository() { return new MetricaRepository(); }

  /**
   * Mantiene compatibilidad con el Factory Method (anterior) si algún cliente externo lo requiere.
   */
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
        throw new Error(`Repositorio de tipo "${type}" no soportado en SQL.`);
    }
  }
}

// Configuración conmutable para intercambiar dinámicamente la fábrica activa (SQL o InMemory)
// Se puede forzar mediante variables de entorno (USE_IN_MEMORY === 'true')
const useInMemory = process.env.USE_IN_MEMORY === 'true' || process.env.NODE_ENV === 'test';

export const repositoryFactory: RepositoryFactory & { createRepository(type: 'usuario' | 'paciente' | 'umbral' | 'lectura' | 'evaluacion' | 'alerta' | 'metrica'): any } = useInMemory
  ? new InMemoryRepositoryFactory()
  : new SqlRepositoryFactory();
