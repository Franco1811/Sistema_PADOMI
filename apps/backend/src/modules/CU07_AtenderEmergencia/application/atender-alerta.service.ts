import { IAlertaRepository } from '../../../../../../shared/domain/repositories/alerta.repository';
import { AlertaRepository } from '../../../../../../shared/infrastructure/interfaces/alerta.interf';
import { AtencionDto } from './atencion.dto';

export class AtenderAlertaService {
  private alertaRepository: IAlertaRepository;

  constructor() {
    this.alertaRepository = new AlertaRepository();
  }

  async atender(dto: AtencionDto): Promise<void> {
    dto.validar();

    // 1. Buscar la alerta
    const alerta = await this.alertaRepository.buscarPorId(dto.alertaId);
    if (!alerta) {
      throw new Error("La alerta no existe.");
    }

    // 2. Validar reglas de dominio (si ya está atendida, lanza error inmutable)
    alerta.marcarComoAtendida();

    // 3. Ejecutar la transacción ACID en la infraestructura
    const fueActualizada = await this.alertaRepository.atenderTransaccionalmente(dto.alertaId);

    if (!fueActualizada) {
      // Condición de carrera: otro médico ganó la transacción
      throw new Error("Esta alerta acaba de ser gestionada por otro colega.");
    }
  }
}
