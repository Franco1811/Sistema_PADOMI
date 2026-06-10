import { IPacienteRepository } from '../../../../../../shared/domain/interface/paciente.interface';
import { IUmbralRepository } from '../../../../../../shared/domain/interface/umbral.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { ActualizarPerfilDto } from './actualizar-perfil.dto';
import { Paciente } from '../../../../../../shared/domain/entities/paciente.entity';
import { Umbral } from '../../../../../../shared/domain/entities/umbral.entity';
import * as crypto from 'crypto';
import { AppDataSource } from '../../../../../../shared/infrastructure/data-source';
import { PacienteEnfermedadModel } from '../../../../../../shared/infrastructure/models/paciente-enfermedad.model';
import { EnfermedadCronicaModel } from '../../../../../../shared/infrastructure/models/enfermedad-cronica.model';
import { EnfermedadCronicaMapping } from '../../../../../../shared/infrastructure/mappings/enfermedad-cronica.mapping';
import { EnfermedadCronica } from '../../../../../../shared/domain/entities/enfermedad-cronica.entity';
import { In } from 'typeorm';

export class GestionarPerfilService {
  private pacienteRepository: IPacienteRepository;
  private umbralRepository: IUmbralRepository;

  constructor() {
    this.pacienteRepository = repositoryFactory.getPacienteRepository();
    this.umbralRepository = repositoryFactory.getUmbralRepository();
  }

  async obtenerPerfil(pacienteId: string): Promise<{ paciente: Paciente, umbrales: Umbral[], enfermedades: EnfermedadCronica[] }> {
    const paciente = await this.pacienteRepository.buscarPorId(pacienteId);
    if (!paciente) {
      throw new Error("Paciente no encontrado");
    }

    const umbrales = await this.umbralRepository.buscarPorPacienteId(pacienteId);

    let enfermedades: EnfermedadCronica[] = [];
    if (process.env.USE_IN_MEMORY === 'true' || !AppDataSource.isInitialized) {
      enfermedades = [
        new EnfermedadCronica(crypto.randomUUID(), 'ENF-0002', 'Hipertensión Arterial Sistémica', 'Incremento continuo de la presion sanguinea')
      ];
    } else {
      const enfermedadesRaw = await AppDataSource.getRepository(PacienteEnfermedadModel).find({
        where: { pacienteId }
      });
      const enfermedadIds = enfermedadesRaw.map(e => e.enfermedadId);
      if (enfermedadIds.length > 0) {
        const models = await AppDataSource.getRepository(EnfermedadCronicaModel).find({
          where: { id: In(enfermedadIds) }
        });
        enfermedades = models.map(m => EnfermedadCronicaMapping.toEntity(m));
      }
    }

    return { paciente, umbrales, enfermedades };
  }

  async actualizarPerfil(dto: ActualizarPerfilDto): Promise<void> {
    dto.validar();

    const paciente = await this.pacienteRepository.buscarPorId(dto.pacienteId);
    if (!paciente) {
      throw new Error("Paciente no encontrado");
    }

    // Actualizar datos del paciente
    if (dto.diagnostico !== undefined || dto.telefono !== undefined || dto.direccion !== undefined) {
      const pacienteActualizado = paciente.clone({
        diagnostico: dto.diagnostico !== undefined ? dto.diagnostico : paciente.diagnostico,
        telefono: dto.telefono !== undefined ? dto.telefono : paciente.telefono,
        direccion: dto.direccion !== undefined ? dto.direccion : paciente.direccion
      });
      await this.pacienteRepository.actualizar(pacienteActualizado);
    }

    // Actualizar umbrales
    if (dto.umbrales !== undefined) {
      const metricaRepository = repositoryFactory.getMetricaRepository();
      const umbralesExistentes = await this.umbralRepository.buscarPorPacienteId(dto.pacienteId);

      // 1. Eliminar los umbrales que ya no están en la lista recibida
      for (const existente of umbralesExistentes) {
        const sigueExistiendo = dto.umbrales.some(u => u.metricaId === existente.metricaId);
        if (!sigueExistiendo) {
          await this.umbralRepository.eliminar(existente.id);
        }
      }

      // 2. Insertar o actualizar los umbrales recibidos
      for (const uDto of dto.umbrales) {
        // Verificar existencia de la métrica antes de guardar umbral
        const metricaExiste = await metricaRepository.buscarPorId(uDto.metricaId);
        if (!metricaExiste) {
          throw new Error(`La métrica con ID '${uDto.metricaId}' no existe en el catálogo.`);
        }

        // Verificar que los valores del umbral personalizado estén dentro del rango permitido por la métrica
        if (uDto.valorMin < metricaExiste.rangoMin || uDto.valorMax > metricaExiste.rangoMax) {
          throw new Error(`Los valores del umbral para '${metricaExiste.nombre}' deben estar dentro del rango permitido por la métrica (${metricaExiste.rangoMin} a ${metricaExiste.rangoMax}).`);
        }

        const existente = umbralesExistentes.find(u => u.metricaId === uDto.metricaId);

        if (existente) {
          const umbralActualizado = existente.clone({
            valorMin: uDto.valorMin,
            valorMax: uDto.valorMax
          });
          await this.umbralRepository.actualizar(umbralActualizado);
        } else {
          const nuevoUmbral = new Umbral(
            crypto.randomUUID(),
            await this.umbralRepository.generarCodigo(),
            dto.pacienteId,
            uDto.metricaId,
            uDto.valorMin,
            uDto.valorMax
          );
          await this.umbralRepository.guardar(nuevoUmbral);
        }
      }
    }
  }
}
