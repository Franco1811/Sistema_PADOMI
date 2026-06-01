import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { EvaluacionModel } from '../models/evaluacion.model';
import { EvaluacionMapping } from '../mappings/evaluacion.mapping';
import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { IEvaluacionRepository } from '../../domain/interface/evaluacion.interface';

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
    const lastEvaluation = await this.repository.find({
      order: { codigo: 'DESC' },
      take: 1
    });

    if (lastEvaluation.length === 0) {
      return 'EVA-0001';
    }

    const match = lastEvaluation[0].codigo.match(/EVA-(\d+)/);
    if (!match) {
      return 'EVA-0001';
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `EVA-${String(nextNumber).padStart(4, '0')}`;
  }
}
