import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { PacienteModel } from '../models/paciente.model';
import { PacienteMapping } from '../mappings/paciente.mapping';
import { Paciente } from '../../domain/entities/paciente.entity';
import { IPacienteRepository } from '../../domain/repositories/paciente.repository';

export class PacienteRepository implements IPacienteRepository {
  private repository: any;

  constructor() {
    this.repository = AppDataSource.getRepository(PacienteModel);
  }

  async guardar(paciente: Paciente): Promise<Paciente> {
    const model = PacienteMapping.toModel(paciente);
    const savedModel = await this.repository.save(model);
    return PacienteMapping.toEntity(savedModel);
  }

  async actualizar(paciente: Paciente): Promise<Paciente> {
    const model = PacienteMapping.toModel(paciente);
    const savedModel = await this.repository.save(model);
    return PacienteMapping.toEntity(savedModel);
  }

  async buscarPorDni(dni: string): Promise<Paciente | null> {
    const model = await this.repository.findOne({ where: { dni } });
    return model ? PacienteMapping.toEntity(model) : null;
  }

  async buscarPorId(id: string): Promise<Paciente | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? PacienteMapping.toEntity(model) : null;
  }

  async generarCodigo(): Promise<string> {
    const count = await this.repository.count();
    const nextNumber = count + 1;
    return `PAC-${String(nextNumber).padStart(4, '0')}`;
  }

  async contarPorMedicoAsignado(medicoId: string): Promise<number> {
    return await this.repository.count({ where: { medicoAsignadoId: medicoId } });
  }

  async listarPorMedicoAsignado(medicoId: string): Promise<Paciente[]> {
    const models = await this.repository.find({ where: { medicoAsignadoId: medicoId } });
    return models.map((model: any) => PacienteMapping.toEntity(model));
  }
}
