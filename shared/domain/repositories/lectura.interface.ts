import { Lectura } from '../entities/lectura.entity';

export interface ILecturaRepository {
  guardar(lectura: Lectura): Promise<Lectura>;
  generarCodigo(): Promise<string>;
}
