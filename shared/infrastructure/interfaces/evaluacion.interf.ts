import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { EvaluacionModel } from '../models/evaluacion.model';
import { EvaluacionMapping } from '../mappings/evaluacion.mapping';
import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { IEvaluacionRepository } from '../../domain/repositories/evaluacion.repository';

export class EvaluacionRepository implements IEvaluacionRepository {
  private repository: Repository<EvaluacionModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(EvaluacionModel);
  }

  async guardar(evaluacion: Evaluacion): Promise<Evaluacion> {
    const model = EvaluacionMapping.toModel(evaluacion);
    const savedModel = await this.repository.save(model);
    return EvaluacionMapping.toEntity(savedModel);
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `EVA-${String(nextNumber).padStart(4, '0')}`;
  }
}
