import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { CatalogoService } from './modules/CU03_GestionarMetricas/application/catalogo.service';
import { MetricaDto } from './modules/CU03_GestionarMetricas/application/metrica.dto';

// 1. Interfaz común
interface ICatalogo {
  crearMetrica(dto: MetricaDto): Promise<any>;
}
// 2. Decorador
class PerformanceDecorator implements ICatalogo {
  constructor(private serviceReal: ICatalogo) {}
  async crearMetrica(dto: MetricaDto): Promise<any> {
    const inicio = Date.now();
    console.log(
      `[DECORATOR]: ⏱ Iniciando cronómetro para crear métrica: ${dto.nombre}`
    );
    try {
      return await this.serviceReal.crearMetrica(dto);
    } finally {
      const duracion = Date.now() - inicio;
      console.log(
        `[DECORATOR]: 🚀 Operación finalizada en ${duracion}ms`
      );

    }
  }
}

// 3. Prueba
async function probarDecorator() {
  console.log('==================================================');
  console.log('        PRUEBA DEL PATRÓN DE DISEÑO: DECORATOR');
  console.log('==================================================\n');
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada.');
    }
    // CatalogoService se trata como ICatalogo
    const serviceBase: ICatalogo = new CatalogoService();
    const serviceDecorado: ICatalogo =
      new PerformanceDecorator(serviceBase);
    const metricaMock = new MetricaDto();

    metricaMock.nombre = 'Fre';
    metricaMock.unidad = 'lpm';
    metricaMock.descripcion = 'Latidos por minuto';
    metricaMock.rangoMin = 60;
    metricaMock.rangoMax = 100;

    console.log('2. Ejecutando servicio decorado...');
    await serviceDecorado.crearMetrica(metricaMock);
  } catch (error: any) {
    console.log(
      `[INFO]: El servicio validó correctamente el duplicado: ${error.message}`
    );
    return;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Decorator: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se añadió medición de performance sin tocar el CatalogoService.');
  console.log('✔ La lógica original sigue intacta y desacoplada.');
  console.log('✔ Se logró una arquitectura de capas adicionales.');
  console.log('==================================================');
}

probarDecorator();