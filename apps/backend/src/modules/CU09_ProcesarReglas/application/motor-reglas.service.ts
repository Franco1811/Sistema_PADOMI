import { IUmbralRepository } from '../../../../../../shared/domain/interface/umbral.interface';
import { IEvaluacionRepository } from '../../../../../../shared/domain/interface/evaluacion.interface';
import { IAlertaRepository } from '../../../../../../shared/domain/interface/alerta.interface';
import { IMetricaRepository } from '../../../../../../shared/domain/interface/metrica.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { Evaluacion } from '../../../../../../shared/domain/entities/evaluacion.entity';
import { Alerta } from '../../../../../../shared/domain/entities/alerta.entity';
import { Lectura } from '../../../../../../shared/domain/entities/lectura.entity';
import { EvaluacionDto } from './evaluacion.dto';
import { IPacienteRepository } from '../../../../../../shared/domain/interface/paciente.interface';
import { DashboardController } from '../../CU06_MonitorearDashboard/presentation/dashboard.controller';
import * as crypto from 'crypto';

export class MotorReglasService {
  private umbralRepository: IUmbralRepository;
  private evaluacionRepository: IEvaluacionRepository;
  private alertaRepository: IAlertaRepository;
  private pacienteRepository: IPacienteRepository;
  private metricaRepository: IMetricaRepository;

  constructor() {
    this.umbralRepository = repositoryFactory.getUmbralRepository();
    this.evaluacionRepository = repositoryFactory.getEvaluacionRepository();
    this.alertaRepository = repositoryFactory.getAlertaRepository();
    this.pacienteRepository = repositoryFactory.getPacienteRepository();
    this.metricaRepository = repositoryFactory.getMetricaRepository();
  }

  async procesarLectura(lectura: Lectura): Promise<EvaluacionDto | null> {
    // 1. Obtener umbrales del paciente
    const umbrales = await this.umbralRepository.buscarPorPacienteId(lectura.pacienteId);

    // Buscar el umbral específico de esta métrica
    const umbral = umbrales.find(u => u.metricaId === lectura.metricaId);
    
    let valorMin: number;
    let valorMax: number;
    let rangoEsperadoMsg: string;

    if (umbral) {
      valorMin = umbral.valorMin;
      valorMax = umbral.valorMax;
      rangoEsperadoMsg = `Esperado entre ${valorMin} y ${valorMax}`;
    } else {
      // Fallback: Si el médico no ha configurado un umbral personalizado, usamos el rango general del catálogo de métricas
      const metrica = await this.metricaRepository.buscarPorId(lectura.metricaId);
      if (!metrica) {
        // Si no existe la métrica en el catálogo, no se puede evaluar.
        return null;
      }
      valorMin = metrica.rangoMin;
      valorMax = metrica.rangoMax;
      rangoEsperadoMsg = `Esperado según rango general entre ${valorMin} y ${valorMax}`;
    }

    // 2. Ejecutar la Lógica de Negocio (Core Domain)
    // Usamos el método estático de la entidad para calcular la severidad. 
    // De esta forma mantenemos las reglas médicas aisladas del framework o la BD.
    const severidad = Evaluacion.calcularSeveridad(lectura.valor, valorMin, valorMax);

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
        `Valor biométrico anómalo: ${lectura.valor} (${rangoEsperadoMsg})`,
        new Date(),
        false
      );

      const savedAlerta = await this.alertaRepository.guardar(alerta);

      // 6. Notificar al médico vía WebSockets en tiempo real
      // Esto empujará la alerta a la pantalla del Frontend de inmediato, sin que el doctor recargue la página.
      DashboardController.emitirNuevaAlerta(paciente.medicoAsignadoId, {
        ...savedAlerta,
        pacienteNombre: paciente.nombres,
        telefono: paciente.telefono,
        direccion: paciente.direccion,
        diagnostico: paciente.diagnostico
      });
    }

    return new EvaluacionDto(lectura.pacienteId, lectura.metricaId, severidad, lectura.id);
  }
}
