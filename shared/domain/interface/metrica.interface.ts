import { Metrica } from '../entities/metrica.entity';

export interface IMetricaRepository {
  guardar(metrica: Metrica): Promise<Metrica>;
  actualizar(metrica: Metrica): Promise<Metrica>;
  buscarPorId(id: string): Promise<Metrica | null>;
  generarCodigo(): Promise<string>;
  buscarPorNombre(nombre: string): Promise<Metrica | null>;
  listarTodas(): Promise<Metrica[]>;
  inactivar(id: string): Promise<void>;
  estaEnUso(id: string): Promise<boolean>;
}
