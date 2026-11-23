import { EventEmitter } from 'events';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { MotorReglasService } from '../application/motor-reglas.service';

// Instancia global del EventEmitter para simular un bus de eventos en memoria
export const eventBus = new EventEmitter();

const motorReglas = new MotorReglasService();
let colaMotor: Promise<any> = Promise.resolve();

// Suscribirse al evento 'nueva_lectura' proveniente del CU-08 (encolado secuencialmente para integridad de códigos EVA-XXXX y ALT-XXXX)
eventBus.on('nueva_lectura', (lectura: Lectura) => {
  colaMotor = colaMotor
    .then(async () => {
      try {
        console.log(`[Motor de Reglas] Iniciando evaluación automática para lectura ${lectura.id} del paciente ${lectura.pacienteId}`);
        const resultado = await motorReglas.procesarLectura(lectura);
        if (resultado) {
          console.log(`[Motor de Reglas] Evaluación completada. Estado: ${resultado.estado}`);
        } else {
          console.log(`[Motor de Reglas] No se encontraron umbrales para la métrica ${lectura.metricaId}`);
        }
      } catch (error) {
        console.error(`[Motor de Reglas] Error crítico procesando lectura ${lectura.id}:`, error);
      }
    })
    .catch(() => {});
});
