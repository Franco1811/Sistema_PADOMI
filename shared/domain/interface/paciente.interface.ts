import { Paciente } from '../entities/paciente.entity';

export interface IPacienteRepository {
  guardar(paciente: Paciente): Promise<Paciente>;
  actualizar(paciente: Paciente): Promise<Paciente>;
  buscarPorDni(dni: string): Promise<Paciente | null>;
  buscarPorId(id: string): Promise<Paciente | null>;
  generarCodigo(): Promise<string>;
  contarPorMedicoAsignado(medicoId: string): Promise<number>;
  listarPorMedicoAsignado(medicoId: string): Promise<Paciente[]>;
}

export interface IPacienteRepository {
  guardar(paciente: Paciente): Promise<Paciente>;
  actualizar(paciente: Paciente): Promise<Paciente>;
  buscarPorDni(dni: string): Promise<Paciente | null>;
  buscarPorId(id: string): Promise<Paciente | null>;
  generarCodigo(): Promise<string>;
  listarTodos(): Promise<Paciente[]>;  // ← Agrega esta línea
  contarPorMedicoAsignado(medicoId: string): Promise<number>;
  listarPorMedicoAsignado(medicoId: string): Promise<Paciente[]>;
}