import { Lectura } from '../entities/lectura.entity';

export interface ILecturaRepository {
  guardar(lectura: Lectura): Promise<Lectura>;
  generarCodigo(): Promise<string>;
  buscarPorPaciente(pacienteId: string, limit?: number): Promise<Lectura[]>;
}
