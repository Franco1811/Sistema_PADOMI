import { ILecturaRepository } from '../../../../../../shared/domain/interface/lectura.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { IngestaDto } from './ingesta.dto';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { eventBus } from '../../CU09_ProcesarReglas/presentation/reglas.event';
import * as crypto from 'crypto';

export class IngestaService {
  private lecturaRepository: ILecturaRepository;
  // Semáforo de exclusión mutua (Mutex) para evitar colisión de código correlativo LEC-XXXX bajo ráfagas concurrentes IoT (JMeter)
  private static colaConcurrencia: Promise<any> = Promise.resolve();

  constructor() {
    this.lecturaRepository = repositoryFactory.getLecturaRepository();
  }

  async procesarIngesta(dto: IngestaDto): Promise<Lectura> {
    // 1. Validar DTO y reglas de dominio de la entidad antes de tocar la BD
    dto.validar();
    new Lectura(crypto.randomUUID(), 'LEC-0000', dto.pacienteId, dto.metricaId, dto.valor, new Date());

    // 2. Sección crítica sincronizada para generación de código correlativo e inserción atómica
    const ejecutarSeccionCritica = async (): Promise<Lectura> => {
      const codigo = await this.lecturaRepository.generarCodigo();
      const lectura = new Lectura(
        crypto.randomUUID(),
        codigo,
        dto.pacienteId,
        dto.metricaId,
        dto.valor,
        new Date()
      );
      return await this.lecturaRepository.guardar(lectura);
    };

    const operacion = IngestaService.colaConcurrencia.then(ejecutarSeccionCritica, ejecutarSeccionCritica);
    IngestaService.colaConcurrencia = operacion.catch(() => {});
    const lecturaGuardada = await operacion;

    // 3. Desacoplamiento mediante Eventos (Event-Driven Architecture)
    eventBus.emit('nueva_lectura', lecturaGuardada);

    return lecturaGuardada;
  }
}
