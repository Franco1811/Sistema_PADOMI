import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UmbralModel } from '../models/umbral.model';
import { UmbralMapping } from '../mappings/umbral.mapping';
import { Umbral } from '../../domain/entities/umbral.entity';
import { IUmbralRepository } from '../../domain/repositories/umbral.repository';

export class UmbralRepository implements IUmbralRepository {
  private repository: Repository<UmbralModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UmbralModel);
  }

  async guardar(umbral: Umbral): Promise<Umbral> {
    const model = UmbralMapping.toModel(umbral);
    const savedModel = await this.repository.save(model);
    return UmbralMapping.toEntity(savedModel);
  }

  async actualizar(umbral: Umbral): Promise<Umbral> {
    const model = UmbralMapping.toModel(umbral);
    const savedModel = await this.repository.save(model);
    return UmbralMapping.toEntity(savedModel);
  }

  async buscarPorPacienteId(pacienteId: string): Promise<Umbral[]> {
    const models = await this.repository.find({ where: { pacienteId } });
    return models.map(model => UmbralMapping.toEntity(model));
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `UMB-${String(nextNumber).padStart(4, "0")}`;
  }
}
