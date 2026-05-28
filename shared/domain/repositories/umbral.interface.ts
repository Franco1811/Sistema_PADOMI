import { Umbral } from '../entities/umbral.entity';

export interface IUmbralRepository {
  guardar(umbral: Umbral): Promise<Umbral>;
  actualizar(umbral: Umbral): Promise<Umbral>;
  generarCodigo(): Promise<string>;
  buscarPorPacienteId(pacienteId: string): Promise<Umbral[]>;
}
