import { IUsuarioRepository } from './usuario.interface';
import { IPacienteRepository } from './paciente.interface';
import { IUmbralRepository } from './umbral.interface';
import { ILecturaRepository } from './lectura.interface';
import { IEvaluacionRepository } from './evaluacion.interface';
import { IAlertaRepository } from './alerta.interface';
import { IMetricaRepository } from './metrica.interface';

export interface RepositoryFactory {
  getUsuarioRepository(): IUsuarioRepository;
  getPacienteRepository(): IPacienteRepository;
  getUmbralRepository(): IUmbralRepository;
  getLecturaRepository(): ILecturaRepository;
  getEvaluacionRepository(): IEvaluacionRepository;
  getAlertaRepository(): IAlertaRepository;
  getMetricaRepository(): IMetricaRepository;
}
