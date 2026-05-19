import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { LecturaModel } from '../models/lectura.model';
import { LecturaMapping } from '../mappings/lectura.mapping';
import { Lectura } from '../../domain/entities/lectura.entity';
import { ILecturaRepository } from '../../domain/repositories/lectura.repository';

export class LecturaRepository implements ILecturaRepository {
  private repository: Repository<LecturaModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(LecturaModel);
  }

  async guardar(lectura: Lectura): Promise<Lectura> {
    const model = LecturaMapping.toModel(lectura);
    const savedModel = await this.repository.save(model);
    return LecturaMapping.toEntity(savedModel);
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `LEC-${String(nextNumber).padStart(4, '0')}`;
  }
}
