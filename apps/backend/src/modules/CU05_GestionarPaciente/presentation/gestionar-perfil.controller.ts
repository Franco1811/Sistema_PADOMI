import { Request, Response } from 'express';
import { GestionarPerfilService } from '../application/gestionar-perfil.service';
import { ActualizarPerfilDto } from '../application/actualizar-perfil.dto';
import { AuthRequest } from '../../../middleware/auth.middleware';

export class GestionarPerfilController {
  private service: GestionarPerfilService;

  constructor() {
    this.service = new GestionarPerfilService();
  }

  obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const resultado = await this.service.obtenerPerfil(id as string);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const dto = new ActualizarPerfilDto();
      dto.pacienteId = req.params.id as string;
      dto.medicoId = authReq.user?.id || req.body.medicoId;
      dto.diagnostico = req.body.diagnostico;
      dto.umbrales = req.body.umbrales;

      await this.service.actualizarPerfil(dto);
      
      res.status(200).json({ mensaje: 'Perfil actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
