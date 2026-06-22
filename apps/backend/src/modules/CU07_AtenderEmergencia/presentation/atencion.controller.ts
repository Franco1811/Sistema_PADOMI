import { Request, Response } from 'express';
import { AtenderAlertaService } from '../application/atender-alerta.service';
import { AtencionDto } from '../application/atencion.dto';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';

export class AtencionController {
  private service: AtenderAlertaService;

  constructor() {
    this.service = new AtenderAlertaService();
  }

  obtenerHistorialAlertas = async (req: Request, res: Response): Promise<void> => {
    try {
      const pacienteId = req.params.pacienteId as string;
      const repository = repositoryFactory.getAlertaRepository();
      const alertas = await repository.buscarHistorialPorPaciente(pacienteId);
      res.status(200).json(alertas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  atenderAlerta = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new AtencionDto();
      dto.alertaId = req.params.id as string;
      // En un caso real, el medicoId vendría del token JWT en middleware
      dto.medicoId = req.body.medicoId;
      dto.resumen = req.body.resumen;
      dto.recomendaciones = req.body.recomendaciones;

      await this.service.atender(dto);
      
      res.status(200).json({ mensaje: 'Alerta gestionada exitosamente' });
    } catch (error: any) {
      console.error('Error al atender alerta en backend:', error);
      // Distinguir colisión (409 Conflict) de error general (400)
      if (error.message.includes("ya ha sido atendida") || error.message.includes("otro colega")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}
