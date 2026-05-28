import { IUmbralRepository } from '../../../../../../shared/domain/repositories/umbral.interface';
import { UmbralRepository } from '../../../../../../shared/infrastructure/repositories/umbral.repository';
import { IEvaluacionRepository } from '../../../../../../shared/domain/repositories/evaluacion.interface';
import { EvaluacionRepository } from '../../../../../../shared/infrastructure/repositories/evaluacion.repository';
import { IAlertaRepository } from '../../../../../../shared/domain/repositories/alerta.interface';
import { AlertaRepository } from '../../../../../../shared/infrastructure/repositories/alerta.repository';
import { Evaluacion } from '../../../../../../shared/domain/entities/evaluacion.entity';
import { Alerta } from '../../../../../../shared/domain/entities/alerta.entity';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { EvaluacionDto } from './evaluacion.dto';
import { IPacienteRepository } from '../../../../../../shared/domain/repositories/paciente.interface';
import { PacienteRepository } from '../../../../../../shared/infrastructure/repositories/paciente.repository';
import { DashboardController } from '../../CU06_MonitorearDashboard/presentation/dashboard.controller';
import * as crypto from 'crypto';

export class MotorReglasService {
  private umbralRepository: IUmbralRepository;
  private evaluacionRepository: IEvaluacionRepository;
  private alertaRepository: IAlertaRepository;
  private pacienteRepository: IPacienteRepository;

  constructor() {
    this.umbralRepository = new UmbralRepository();
    this.evaluacionRepository = new EvaluacionRepository();
    this.alertaRepository = new AlertaRepository();
    this.pacienteRepository = new PacienteRepository();
  }

  async procesarLectura(lectura: Lectura): Promise<EvaluacionDto | null> {
    // 1. Obtener umbrales del paciente
    const umbrales = await this.umbralRepository.buscarPorPacienteId(lectura.pacienteId);
    
    // Buscar el umbral específico de esta métrica
    const umbral = umbrales.find(u => u.metricaId === lectura.metricaId);
    if (!umbral) {
      // Si no hay umbral, no se puede evaluar.
      return null;
    }

    // 2. Ejecutar la Lógica de Negocio (Core Domain)
    // Usamos el método estático de la entidad para calcular la severidad. 
    // De esta forma mantenemos las reglas médicas aisladas del framework o la BD.
    const severidad = Evaluacion.calcularSeveridad(lectura.valor, umbral.valorMin, umbral.valorMax);

    // 3. Obtener al paciente para asignarle el médico responsable a la evaluación
    const paciente = await this.pacienteRepository.buscarPorId(lectura.pacienteId);
    if (!paciente) return null;

    // 4. Guardar la evaluación en el historial
    const codigoEva = await this.evaluacionRepository.generarCodigo();
    const evaluacion = new Evaluacion(
      crypto.randomUUID(),
      codigoEva,
      lectura.pacienteId,
      paciente.medicoAsignadoId, // Requerido por la BD (NOT NULL)
      new Date(),
      `Evaluación automática: Resultado ${severidad} para valor ${lectura.valor}`,
      'Monitoreo continuo.'
    );
    await this.evaluacionRepository.guardar(evaluacion);

    // 4. Si hay riesgo, generar alerta
    if (severidad === 'CRITICO' || severidad === 'ADVERTENCIA') {
      const alertaId = crypto.randomUUID();
      // Generar un código único corto
      const codigoAlt = await this.alertaRepository.generarCodigo();

      const alerta = new Alerta(
        alertaId,
        codigoAlt,
        lectura.pacienteId,
        lectura.id,
        severidad,
        `Valor biométrico anómalo: ${lectura.valor} (Esperado entre ${umbral.valorMin} y ${umbral.valorMax})`,
        new Date(),
        false
      );

      const savedAlerta = await this.alertaRepository.guardar(alerta);

      // 6. Notificar al médico vía WebSockets en tiempo real
      // Esto empujará la alerta a la pantalla del Frontend de inmediato, sin que el doctor recargue la página.
      DashboardController.emitirNuevaAlerta(paciente.medicoAsignadoId, savedAlerta);
    }

    return new EvaluacionDto(lectura.pacienteId, lectura.metricaId, severidad, lectura.id);
  }
}
