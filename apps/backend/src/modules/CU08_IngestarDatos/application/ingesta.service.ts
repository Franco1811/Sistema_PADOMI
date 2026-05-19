import { ILecturaRepository } from '../../../../../../shared/domain/repositories/lectura.repository';
import { LecturaRepository } from '../../../../../../shared/infrastructure/interfaces/lectura.interf';
import { IngestaDto } from './ingesta.dto';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { eventBus } from '../../CU09_ProcesarReglas/presentation/reglas.event';
import * as crypto from 'crypto';

export class IngestaService {
  private lecturaRepository: ILecturaRepository;

  constructor() {
    this.lecturaRepository = new LecturaRepository();
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

    // 5. Emitir evento asíncrono para el Motor de Reglas (CU-09)
    // De esta manera el controlador HTTP puede responder instantáneamente.
    eventBus.emit('nueva_lectura', lecturaGuardada);

    return lecturaGuardada;
  }
}
