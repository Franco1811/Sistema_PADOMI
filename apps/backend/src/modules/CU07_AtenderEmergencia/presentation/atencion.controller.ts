import { Request, Response } from 'express';
import { AtenderAlertaService } from '../application/atender-alerta.service';
import { AtencionDto } from '../application/atencion.dto';

export class AtencionController {
  private service: AtenderAlertaService;

  constructor() {
    this.service = new AtenderAlertaService();
  }

  atenderAlerta = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new AtencionDto();
      dto.alertaId = req.params.id as string;
      // En un caso real, el medicoId vendría del token JWT en middleware
      dto.medicoId = req.body.medicoId;
      dto.comentario = req.body.comentario;

      await this.service.atender(dto);
      
      res.status(200).json({ mensaje: 'Alerta gestionada exitosamente' });
    } catch (error: any) {
      // Distinguir colisión (409 Conflict) de error general (400)
      if (error.message.includes("ya ha sido atendida") || error.message.includes("otro colega")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };
}
