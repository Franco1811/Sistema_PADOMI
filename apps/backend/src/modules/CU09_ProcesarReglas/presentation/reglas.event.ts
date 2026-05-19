import { EventEmitter } from 'events';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { MotorReglasService } from '../application/motor-reglas.service';

// Instancia global del EventEmitter para simular un bus de eventos en memoria
export const eventBus = new EventEmitter();

const motorReglas = new MotorReglasService();

// Suscribirse al evento 'nueva_lectura' proveniente del CU-08
eventBus.on('nueva_lectura', async (lectura: Lectura) => {
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
});
