import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UmbralModel } from '../models/umbral.model';
import { UmbralMapping } from '../mappings/umbral.mapping';
import { Umbral } from '../../domain/entities/umbral.entity';
import { IUmbralRepository } from '../../domain/interface/umbral.interface';

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
    const lastThreshold = await this.repository.find({
      order: { codigo: 'DESC' },
      take: 1
    });

    if (lastThreshold.length === 0) {
      return 'UMB-0001';
    }

    const match = lastThreshold[0].codigo.match(/UMB-(\d+)/);
    if (!match) {
      return 'UMB-0001';
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `UMB-${String(nextNumber).padStart(4, "0")}`;
  }

  async eliminar(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
