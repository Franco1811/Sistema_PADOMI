import { Umbral } from '../entities/umbral.entity';

export interface IUmbralRepository {
  guardar(umbral: Umbral): Promise<Umbral>;
  actualizar(umbral: Umbral): Promise<Umbral>;
  buscarPorPacienteId(pacienteId: string): Promise<Umbral[]>;
}
