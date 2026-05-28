// Servicio de aplicación para el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Orquesta la gestión de parámetros clínicos: verifica duplicados, guarda nuevas métricas y actualiza la caché.

import { IMetricaRepository } from '../domain/metrica.interface';
import { MetricaRepository } from '../infrastructure/metrica.repository';
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
      await this.metricaRepository.generarCodigo(),
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

    // 1. Validar nombre duplicado si se intenta cambiar
    if (dto.nombre && dto.nombre !== metrica.nombre) {
      const existe = await this.metricaRepository.buscarPorNombre(dto.nombre);
      if (existe) {
        throw new Error("Ya existe una métrica con ese nombre");
      }
    }

    // 2. Validaciones de formato
    if (dto.nombre !== undefined && dto.nombre.length < 2) {
      throw new Error("Nombre de métrica inválido");
    }
    if (dto.unidad !== undefined && dto.unidad.length < 1) {
      throw new Error("Unidad de medida inválida");
    }
    const nuevoMin = dto.rangoMin !== undefined ? dto.rangoMin : metrica.rangoMin;
    const nuevoMax = dto.rangoMax !== undefined ? dto.rangoMax : metrica.rangoMax;
    if (nuevoMin < 0) {
      throw new Error("El rango mínimo debe ser positivo");
    }
    if (nuevoMax <= nuevoMin) {
      throw new Error("El rango máximo debe ser mayor al mínimo");
    }

    const metricaActualizada = new Metrica(
      metrica.id,
      metrica.codigo,
      dto.nombre || metrica.nombre,
      dto.unidad || metrica.unidad,
      dto.descripcion !== undefined ? dto.descripcion : metrica.descripcion,
      nuevoMin,
      nuevoMax
    );

    return await this.metricaRepository.actualizar(metricaActualizada);
  }

  async eliminarMetrica(id: string): Promise<void> {
    const enUso = await this.metricaRepository.estaEnUso(id);
    if (enUso) {
      throw new Error("No se puede eliminar la métrica porque está en uso por algún paciente o tiene lecturas registradas");
    }
    await this.metricaRepository.inactivar(id);
  }
}
