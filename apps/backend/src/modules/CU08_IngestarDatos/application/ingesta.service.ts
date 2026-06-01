import { ILecturaRepository } from '../../../../../../shared/domain/interface/lectura.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { IngestaDto } from './ingesta.dto';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { eventBus } from '../../CU09_ProcesarReglas/presentation/reglas.event';
import * as crypto from 'crypto';

export class IngestaService {
  private lecturaRepository: ILecturaRepository;

  constructor() {
    this.lecturaRepository = repositoryFactory.getLecturaRepository();
  }

  async procesarIngesta(dto: IngestaDto): Promise<Lectura> {
    // 1. Validar DTO
    dto.validar();

    // 2. Generar código
    const codigo = await this.lecturaRepository.generarCodigo();

    // 3. Crear entidad de Dominio
    const lectura = new Lectura(
      crypto.randomUUID(),
      codigo,
      dto.pacienteId,
      dto.metricaId,
      dto.valor,
      new Date()
    );

    // 4. Guardar en base de datos
    const lecturaGuardada = await this.lecturaRepository.guardar(lectura);

    // 5. Desacoplamiento mediante Eventos (Event-Driven Architecture)
    // En lugar de procesar las reglas clínicas aquí mismo y hacer esperar al dispositivo IoT,
    // emitimos un evento en segundo plano. Esto permite que el endpoint devuelva el '201 Created'
    // instantáneamente, mientras que el Motor de Reglas hace el trabajo pesado por detrás.
    eventBus.emit('nueva_lectura', lecturaGuardada);

    return lecturaGuardada;
  }
}
