// Controlador para el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Recibe las solicitudes del administrador, delega la lógica al servicio de aplicación y retorna la respuesta.
// No contiene lógica de validación, solo gestiona la comunicación entre la API y el servicio.

import { Request, Response } from 'express';
import { CatalogoService } from '../application/catalogo.service';
import { MetricaDto } from '../application/metrica.dto';

export class CatalogoController {
  private service: CatalogoService;

  constructor() {
    this.service = new CatalogoService();
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const dto = new MetricaDto();
      dto.nombre = req.body.nombre;
      dto.unidad = req.body.unidad;
      dto.descripcion = req.body.descripcion;
      dto.rangoMin = req.body.rangoMin;
      dto.rangoMax = req.body.rangoMax;

      const metrica = await this.service.crearMetrica(dto);
      res.status(201).json(metrica);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al crear métrica' });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const metricas = await this.service.listarMetricas();
      res.status(200).json(metricas);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al listar métricas' });
    }
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const dto: Partial<MetricaDto> = {
        nombre: req.body.nombre,
        unidad: req.body.unidad,
        descripcion: req.body.descripcion,
        rangoMin: req.body.rangoMin,
        rangoMax: req.body.rangoMax
      };

      const metrica = await this.service.actualizarMetrica(idStr, dto);
      res.status(200).json(metrica);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar métrica' });
    }
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      await this.service.eliminarMetrica(idStr);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al eliminar métrica' });
    }
  }
}
