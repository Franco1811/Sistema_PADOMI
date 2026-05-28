import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { LecturaModel } from '../models/lectura.model';
import { LecturaMapping } from '../mappings/lectura.mapping';
import { Lectura } from '../../domain/entities/lectura.entity';
import { ILecturaRepository } from '../../domain/repositories/lectura.interface';

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
    const lastReading = await this.repository.find({
      order: { codigo: 'DESC' },
      take: 1
    });

    if (lastReading.length === 0) {
      return 'LEC-0001';
    }

    const match = lastReading[0].codigo.match(/LEC-(\d+)/);
    if (!match) {
      return 'LEC-0001';
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `LEC-${String(nextNumber).padStart(4, '0')}`;
  }
}
