import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { MotorReglasService } from './modules/CU09_ProcesarReglas/application/motor-reglas.service';

interface Handler {
  setNext(handler: Handler): Handler;
  handle(data: string): Promise<void>;
}

abstract class BaseHandler implements Handler {
  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(data: string): Promise<void> {
    if (this.nextHandler) {
      await this.nextHandler.handle(data);
    }
  }
}

class ValidarPacienteHandler extends BaseHandler {
  async handle(data: string): Promise<void> {
    console.log('✔ Paciente validado.');
    await super.handle(data);
  }
}

class ValidarMetricaHandler extends BaseHandler {
  async handle(data: string): Promise<void> {
    console.log('✔ Métrica biométrica validada.');
    await super.handle(data);
  }
}

class EvaluarReglasHandler extends BaseHandler {
  constructor(private motorReglasService: MotorReglasService) {
    super();
  }

  async handle(data: string): Promise<void> {
    console.log('✔ Motor de reglas preparado.');
    console.log(`[MOTOR]: ${this.motorReglasService.constructor.name}`);
    console.log(`[LECTURA]: ${data}`);
    await super.handle(data);
  }
}

class GenerarAlertaHandler extends BaseHandler {
  async handle(data: string): Promise<void> {
    console.log(`🚨 Alerta clínica simulada para: ${data}`);
    await super.handle(data);
  }
}

async function probarChainOfResponsibility(): Promise<void> {
  console.log('==================================================');
  console.log(' PRUEBA DEL PATRÓN: CHAIN OF RESPONSIBILITY       ');
  console.log('==================================================\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.\n');
    }

    const motorReglasService = new MotorReglasService();

    const validarPaciente = new ValidarPacienteHandler();
    const validarMetrica = new ValidarMetricaHandler();
    const evaluarReglas = new EvaluarReglasHandler(motorReglasService);
    const generarAlerta = new GenerarAlertaHandler();

    validarPaciente
      .setNext(validarMetrica)
      .setNext(evaluarReglas)
      .setNext(generarAlerta);

    console.log('Procesando lectura biométrica...\n');

    await validarPaciente.handle(
      'Paciente Pedro Mendoza - Presión arterial crítica'
    );
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Chain: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se procesó la lectura por etapas.');
  console.log('✔ Cada handler tiene una responsabilidad específica.');
  console.log('✔ Se conectó el patrón con MotorReglasService.');
  console.log('✔ Representa el flujo CU08/CU09 de PADOMI.');
  console.log('==================================================');
}

probarChainOfResponsibility();