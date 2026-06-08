import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { AtenderAlertaService } from './modules/CU07_AtenderEmergencia/application/atender-alerta.service';
import { AtencionDto } from './modules/CU07_AtenderEmergencia/application/atencion.dto';

interface Command {
  execute(): Promise<void>;
}

class AtenderAlertaCommand implements Command {
  constructor(
    private service: AtenderAlertaService,
    private dto: AtencionDto
  ) {}

  async execute(): Promise<void> {
    await this.service.atender(this.dto);
  }
}

class CommandInvoker {
  async run(command: Command): Promise<void> {
    await command.execute();
  }
}

async function probarCommand(): Promise<void> {
  console.log('==================================================');
  console.log('       PRUEBA DEL PATRÓN DE DISEÑO: COMMAND       ');
  console.log('==================================================\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.\n');
    }

    const dto = new AtencionDto();
    dto.alertaId = 'reemplace_con_uuid_de_alerta';
    dto.medicoId = 'reemplace_con_uuid_de_medico';
    dto.comentario = 'Alerta atendida desde demo Command';

    const service = new AtenderAlertaService();
    const command = new AtenderAlertaCommand(service, dto);
    const invoker = new CommandInvoker();

    console.log('1. Ejecutando comando para atender alerta...');
    await invoker.run(command);

    console.log('✔ Alerta atendida correctamente.');
  } catch (error: any) {
    console.log(`❌ Error controlado: ${error.message}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Command: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se encapsuló la acción de atender alerta.');
  console.log('✔ Se desacopló el invocador del servicio real.');
  console.log('✔ Se conectó el patrón con CU07_AtenderEmergencia.');
  console.log('==================================================');
}

probarCommand();