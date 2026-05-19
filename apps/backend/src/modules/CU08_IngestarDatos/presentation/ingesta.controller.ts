import { Request, Response } from 'express';
import { IngestaService } from '../application/ingesta.service';
import { IngestaDto } from '../application/ingesta.dto';

export class IngestaController {
  private service: IngestaService;

  constructor() {
    this.service = new IngestaService();
  }

  recibirIngesta = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new IngestaDto();
      dto.pacienteId = req.body.pacienteId;
      dto.metricaId = req.body.metricaId;
      dto.valor = req.body.valor;

      const resultado = await this.service.procesarIngesta(dto);
      
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
