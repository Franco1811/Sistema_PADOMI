// Implementación real de la persistencia de métricas clínicas usando TypeORM (CU-03)
// Se conecta con el repositorio para ejecutar el guardado físico en la base de datos.

import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../../shared/infrastructure/data-source';
import { MetricaModel } from '../../../../../../shared/infrastructure/models/metrica.model';
import { MetricaMapping } from '../../../../../../shared/infrastructure/mappings/metrica.mapping';
import { Metrica } from '../../../../../../shared/domain/entities/metrica.entity';
import { IMetricaRepository } from '../domain/metrica.repository';

export class MetricaRepository implements IMetricaRepository {
  private repository: any;

  constructor() {
    this.repository = AppDataSource.getRepository(MetricaModel);
  }

  async guardar(metrica: Metrica): Promise<Metrica> {
    const model = MetricaMapping.toModel(metrica);
    const savedModel = await this.repository.save(model);
    return MetricaMapping.toEntity(savedModel);
  }

  async actualizar(metrica: Metrica): Promise<Metrica> {
    const model = MetricaMapping.toModel(metrica);
    const updatedModel = await this.repository.save(model);
    return MetricaMapping.toEntity(updatedModel);
  }

  async buscarPorId(id: string): Promise<Metrica | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? MetricaMapping.toEntity(model) : null;
  }

  async buscarPorNombre(nombre: string): Promise<Metrica | null> {
    const model = await this.repository.findOne({ where: { nombre } });
    return model ? MetricaMapping.toEntity(model) : null;
  }

  async listarTodas(): Promise<Metrica[]> {
    const models = await this.repository.find();
    return models.map((model: any) => MetricaMapping.toEntity(model));
  }

  async inactivar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `MET-${String(nextNumber).padStart(4, "0")}`;
  }
}
