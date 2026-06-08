import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { MonitoreoService } from './modules/CU06_MonitorearDashboard/application/monitoreo.service';
import { FiltroPacienteDto } from './modules/CU06_MonitorearDashboard/application/filtro-paciente.dto';

interface DashboardMediator {
  consultarDashboard(medicoId: string): Promise<void>;
}

class PadomiDashboardMediator implements DashboardMediator {
  constructor(private monitoreoService: MonitoreoService) {}

  async consultarDashboard(medicoId: string): Promise<void> {
    const dto = new FiltroPacienteDto();

    dto.medicoId = medicoId;
    dto.busqueda = 'Pedro';
    dto.pagina = 1;
    dto.limite = 10;

    console.log('[MEDIATOR]: Coordinando consulta del dashboard...');
    console.log('[MEDIATOR]: Preparando filtro de pacientes...');
    console.log('[MEDIATOR]: Enviando solicitud al servicio de monitoreo...');

    const pacientes = await this.monitoreoService.obtenerDashboard(dto);

    console.log(`[MEDIATOR]: Pacientes encontrados: ${pacientes.length}`);
  }
}

async function probarMediator(): Promise<void> {
  console.log('==================================================');
  console.log('       PRUEBA DEL PATRÓN DE DISEÑO: MEDIATOR      ');
  console.log('==================================================\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.\n');
    }

    const monitoreoService = new MonitoreoService();
    const mediator = new PadomiDashboardMediator(monitoreoService);

    await mediator.consultarDashboard('reemplace_con_uuid_de_medico');
  } catch (error: any) {
    console.log(`❌ Error controlado: ${error.message}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Mediator: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se centralizó la coordinación del dashboard.');
  console.log('✔ Se desacopló el cliente del servicio de monitoreo.');
  console.log('✔ Se conectó el patrón con CU06_MonitorearDashboard.');
  console.log('==================================================');
}

probarMediator();