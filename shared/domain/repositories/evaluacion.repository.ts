import { Evaluacion } from '../entities/evaluacion.entity';

export interface IEvaluacionRepository {
  guardar(evaluacion: Evaluacion): Promise<Evaluacion>;
  generarCodigo(): Promise<string>;
}
