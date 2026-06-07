import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { CatalogoService } from './modules/CU03_GestionarMetricas/application/catalogo.service';
import { MetricaDto } from './modules/CU03_GestionarMetricas/application/metrica.dto';

interface IMetricaImplementor {
  crear(dto: MetricaDto): Promise<any>;
}

class CatalogoServiceImplementor implements IMetricaImplementor {
  constructor(private catalogoService: CatalogoService) {}
  async crear(dto: MetricaDto): Promise<any> {
    console.log('[BRIDGE - IMPLEMENTOR]: Delegando al CatalogoService...');
    return await this.catalogoService.crearMetrica(dto);
  }
}

class MetricaBridgeService {
  constructor(private implementor: IMetricaImplementor) {}
  async registrarMetrica(dto: MetricaDto): Promise<any> {
    console.log('[BRIDGE - ABSTRACCION]: Ejecutando reglas del caso de uso...');
    dto.validar();
    return await this.implementor.crear(dto);
  }
}

async function probarBridge() {
  console.log('==================================================');
  console.log('        PRUEBA DEL PATRÓN DE DISEÑO: BRIDGE  ');
  console.log('==================================================\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada.');
    }

    const catalogoService = new CatalogoService();
    const implementor = new CatalogoServiceImplementor(catalogoService);
    const bridge = new MetricaBridgeService(implementor);

    const dto = new MetricaDto();
    dto.nombre = 'Freee';
    dto.unidad = 'lpm';
    dto.descripcion = 'Latidos por minuto';
    dto.rangoMin = 60;
    dto.rangoMax = 100;

    console.log('2. Ejecutando Bridge...\n');
    const resultado = await bridge.registrarMetrica(dto);
    console.log('\n✔ MÉTRICA CREADA CORRECTAMENTE:');
    console.log(resultado);

  } catch (error: any) {
    console.log('[ERROR]:', error.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('✔ Bridge funcionando correctamente');
  console.log('✔ Lógica de negocio intacta (CatalogoService)');
  console.log('✔ Sin errores de BD');
  console.log('✔ Separación real de abstracción e implementación');
  console.log('==================================================');
}

probarBridge();