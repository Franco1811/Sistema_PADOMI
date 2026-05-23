import { IPacienteRepository } from '../../../../../../shared/domain/repositories/paciente.repository';
import { PacienteRepository } from '../../../../../../shared/infrastructure/interfaces/paciente.interf';
import { IUmbralRepository } from '../../../../../../shared/domain/repositories/umbral.repository';
import { UmbralRepository } from '../../../../../../shared/infrastructure/interfaces/umbral.interf';
import { MetricaRepository } from '../../CU03_GestionarMetricas/infrastructure/metrica.interf';
import { ActualizarPerfilDto } from './actualizar-perfil.dto';
import { Paciente } from '../../../../../../shared/domain/entities/paciente.entity';
import { Umbral } from '../../../../../../shared/domain/entities/umbral.entity';
import * as crypto from 'crypto';

export class GestionarPerfilService {
  private pacienteRepository: IPacienteRepository;
  private umbralRepository: IUmbralRepository;

  constructor() {
    this.pacienteRepository = new PacienteRepository();
    this.umbralRepository = new UmbralRepository();
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
    if (dto.diagnostico !== undefined) {
      const pacienteActualizado = new Paciente(
        paciente.id,
        paciente.codigo,
        paciente.dni,
        paciente.nombres,
        paciente.edad,
        dto.diagnostico,
        paciente.medicoAsignadoId
      );
      await this.pacienteRepository.actualizar(pacienteActualizado);
    }

    // Actualizar umbrales
    if (dto.umbrales && dto.umbrales.length > 0) {
      const metricaRepository = new MetricaRepository();
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
        
        const umbral = new Umbral(
          existente ? existente.id : crypto.randomUUID(),
          existente ? existente.codigo : await this.umbralRepository.generarCodigo(),
          dto.pacienteId,
          uDto.metricaId,
          uDto.valorMin,
          uDto.valorMax
        );
        
        if (existente) {
          await this.umbralRepository.actualizar(umbral);
        } else {
          await this.umbralRepository.guardar(umbral);
        }
      }
    }
  }
}
