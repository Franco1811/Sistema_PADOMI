import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { AlertaModel } from '../models/alerta.model';
import { AlertaMapping } from '../mappings/alerta.mapping';
import { Alerta } from '../../domain/entities/alerta.entity';
import { IAlertaRepository } from '../../domain/repositories/alerta.repository';

export class AlertaRepository implements IAlertaRepository {
  private repository: Repository<AlertaModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(AlertaModel);
  }

  async buscarPorId(id: string): Promise<Alerta | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? AlertaMapping.toEntity(model) : null;
  }

  async buscarActivasPorPaciente(pacienteId: string): Promise<Alerta[]> {
    const models = await this.repository.find({
      where: { pacienteId, atendida: false },
      order: { fecha: 'DESC' }
    });
    return models.map(model => AlertaMapping.toEntity(model));
  }

  async guardar(alerta: Alerta): Promise<Alerta> {
    const model = AlertaMapping.toModel(alerta);
    const savedModel = await this.repository.save(model);
    return AlertaMapping.toEntity(savedModel);
  }

  async atenderTransaccionalmente(alertaId: string): Promise<boolean> {
    // ACID: Update solo si atendida = false. Retorna true si se actualizó, false si ya estaba atendida.
    const result = await this.repository.update(
      { id: alertaId, atendida: false },
      { atendida: true }
    );
    return result.affected ? result.affected > 0 : false;
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `ALT-${String(nextNumber).padStart(4, "0")}`;
  }
}
