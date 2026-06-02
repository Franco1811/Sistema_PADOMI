import { IPacienteRepository } from '../../../../../../shared/domain/interface/paciente.interface';
import { IUmbralRepository } from '../../../../../../shared/domain/interface/umbral.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { ActualizarPerfilDto } from './actualizar-perfil.dto';
import { Paciente } from '../../../../../../shared/domain/entities/paciente.entity';
import { Umbral } from '../../../../../../shared/domain/entities/umbral.entity';
import * as crypto from 'crypto';

export class GestionarPerfilService {
  private pacienteRepository: IPacienteRepository;
  private umbralRepository: IUmbralRepository;

  constructor() {
    this.pacienteRepository = repositoryFactory.getPacienteRepository();
    this.umbralRepository = repositoryFactory.getUmbralRepository();
  }

  async obtenerPerfil(pacienteId: string): Promise<{ paciente: Paciente, umbrales: Umbral[] }> {
    const paciente = await this.pacienteRepository.buscarPorId(pacienteId);
    if (!paciente) {
      throw new Error("Paciente no encontrado");
    }

    const umbrales = await this.umbralRepository.buscarPorPacienteId(pacienteId);

    return { paciente, umbrales };
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
    if (dto.umbrales && dto.umbrales.length > 0) {
      const metricaRepository = repositoryFactory.getMetricaRepository();
      const umbralesExistentes = await this.umbralRepository.buscarPorPacienteId(dto.pacienteId);

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
