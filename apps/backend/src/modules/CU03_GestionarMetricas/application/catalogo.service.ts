// Servicio de aplicación para el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Orquesta la gestión de parámetros clínicos: verifica duplicados, guarda nuevas métricas y actualiza la caché.

import { IMetricaRepository } from '../domain/metrica.repository';
import { MetricaRepository } from '../infrastructure/metrica.interf';
import { Metrica } from '../../../../../../shared/domain/entities/metrica.entity';
import { MetricaDto } from './metrica.dto';

export class CatalogoService {
  private metricaRepository: IMetricaRepository;

  constructor() {
    this.metricaRepository = new MetricaRepository();
  }

  async crearMetrica(dto: MetricaDto): Promise<Metrica> {
    dto.validar();

    const existe = await this.metricaRepository.buscarPorNombre(dto.nombre);
    if (existe) {
      throw new Error("Ya existe una métrica con ese nombre");
    }

    const metrica = new Metrica(
      crypto.randomUUID(),
      '', // código se generará después
      dto.nombre,
      dto.unidad,
      dto.descripcion || '',
      dto.rangoMin,
      dto.rangoMax
    );

    return await this.metricaRepository.guardar(metrica);
  }

  async listarMetricas(): Promise<Metrica[]> {
    return await this.metricaRepository.listarTodas();
  }

  async actualizarMetrica(id: string, dto: Partial<MetricaDto>): Promise<Metrica> {
    const metrica = await this.metricaRepository.buscarPorId(id);
    if (!metrica) {
      throw new Error("Métrica no encontrada");
    }

    const metricaActualizada = new Metrica(
      metrica.id,
      metrica.codigo,
      dto.nombre || metrica.nombre,
      dto.unidad || metrica.unidad,
      dto.descripcion !== undefined ? dto.descripcion : metrica.descripcion,
      dto.rangoMin !== undefined ? dto.rangoMin : metrica.rangoMin,
      dto.rangoMax !== undefined ? dto.rangoMax : metrica.rangoMax
    );

    return await this.metricaRepository.actualizar(metricaActualizada);
  }

  async eliminarMetrica(id: string): Promise<void> {
    await this.metricaRepository.inactivar(id);
  }
}
