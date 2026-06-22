import { Repository, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../data-source';
import { AlertaModel } from '../models/alerta.model';
import { AlertaMapping } from '../mappings/alerta.mapping';
import { Alerta } from '../../domain/entities/alerta.entity';
import { IAlertaRepository } from '../../domain/interface/alerta.interface';

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

  async buscarHistorialPorPaciente(pacienteId: string): Promise<Alerta[]> {
    // Retorna el historial mensual (últimos 30 días) tanto atendidas como no atendidas
    const limiteFecha = new Date();
    limiteFecha.setDate(limiteFecha.getDate() - 30);

    const models = await this.repository.find({
      where: { 
        pacienteId,
        fecha: MoreThanOrEqual(limiteFecha)
      },
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
    const lastAlert = await this.repository.find({
      order: { codigo: 'DESC' },
      take: 1
    });

    if (lastAlert.length === 0) {
      return 'ALT-0001';
    }

    const match = lastAlert[0].codigo.match(/ALT-(\d+)/);
    if (!match) {
      return 'ALT-0001';
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `ALT-${String(nextNumber).padStart(4, "0")}`;
  }
}
