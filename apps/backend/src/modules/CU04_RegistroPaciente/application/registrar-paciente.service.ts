// Servicio de aplicación para Registrar Paciente Crónico (CU-04)
// Orquesta el flujo de registro y validación inicial de pacientes.
// Verifica existencia de DNI, genera código PAC-XXXX e invoca al repositorio para guardar.

import { IPacienteRepository } from '../../../../../../shared/domain/repositories/paciente.repository';
import { PacienteRepository } from '../../../../../../shared/infrastructure/interfaces/paciente.interf';
import { Paciente } from '../../../../../../shared/domain/entities/paciente.entity';
import { PacienteDto } from './paciente.dto';

export class RegistrarPacienteService {
  private pacienteRepository: IPacienteRepository;

  constructor() {
    this.pacienteRepository = new PacienteRepository();
  }

  async registrarPaciente(dto: PacienteDto): Promise<Paciente> {
    dto.validar();

    // Verificar si el DNI ya existe
    const existe = await this.pacienteRepository.buscarPorDni(dto.dni);
    if (existe) {
      throw new Error("Ya existe un paciente con ese DNI.");
    }

    // Generar código correlativo PAC-XXXX
    const codigo = await this.pacienteRepository.generarCodigo();

    // Verificar límite de carga laboral del médico (RNF-20)
    const pacientesAsignados = await this.pacienteRepository.contarPorMedicoAsignado(dto.medicoAsignadoId);
    if (pacientesAsignados >= 500) {
      // De acuerdo con RNF-20, emitimos una alerta. En el backend, esto puede ser lanzar un error o registrar un warning.
      // Dependiendo de la regla exacta, si es estricto:
      throw new Error("El médico tratante ha superado el límite de 500 pacientes asignados (RNF-20).");
    }

    const paciente = new Paciente(
      crypto.randomUUID(),
      codigo,
      dto.dni,
      dto.nombres,
      dto.edad,
      dto.diagnostico,
      dto.medicoAsignadoId
    );

    return await this.pacienteRepository.guardar(paciente);
  }
}
