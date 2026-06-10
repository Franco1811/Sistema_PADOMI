import { IAlertaRepository } from '../../../../../../shared/domain/interface/alerta.interface';
import { IEvaluacionRepository } from '../../../../../../shared/domain/interface/evaluacion.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { Evaluacion } from '../../../../../../shared/domain/entities/evaluacion.entity';
import { AtencionDto } from './atencion.dto';
import * as crypto from 'crypto';

export class AtenderAlertaService {
  private alertaRepository: IAlertaRepository;
  private evaluacionRepository: IEvaluacionRepository;

  constructor() {
    this.alertaRepository = repositoryFactory.getAlertaRepository();
    this.evaluacionRepository = repositoryFactory.getEvaluacionRepository();
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

    // 4. Registrar la Evaluación Clínica asociada a la alerta para auditoría (CU-07)
    const codigoEva = await this.evaluacionRepository.generarCodigo();
    const evaluacion = new Evaluacion(
      crypto.randomUUID(),
      codigoEva,
      alerta.pacienteId,
      dto.medicoId,
      new Date(),
      dto.resumen,
      dto.recomendaciones,
      alerta.id // alertaId de relación
    );

    await this.evaluacionRepository.guardar(evaluacion);
  }
}
