import { Alerta } from '../entities/alerta.entity';

export interface IAlertaRepository {
  buscarPorId(id: string): Promise<Alerta | null>;
  buscarActivasPorPaciente(pacienteId: string): Promise<Alerta[]>;
  guardar(alerta: Alerta): Promise<Alerta>;
  atenderTransaccionalmente(alertaId: string): Promise<boolean>;
}
