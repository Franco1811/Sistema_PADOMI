import { Request, Response } from 'express';
import { MonitoreoService } from '../application/monitoreo.service';
import { FiltroPacienteDto } from '../application/filtro-paciente.dto';
import { Server as SocketIOServer } from 'socket.io';

export class DashboardController {
  private service: MonitoreoService;
  private static io: SocketIOServer;

  constructor() {
    this.service = new MonitoreoService();
  }

  // Inicializa WebSocket
  public static initWebSocket(httpServer: any) {
    DashboardController.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
      }
    });

    DashboardController.io.on('connection', (socket) => {
      console.log('Médico conectado al Dashboard:', socket.id);
      
      // El médico se une a una sala con su ID para recibir solo sus alertas
      socket.on('join', (medicoId: string) => {
        socket.join(medicoId);
        console.log(`Médico ${medicoId} unido a su sala de monitoreo`);
      });

      socket.on('disconnect', () => {
        console.log('Médico desconectado del Dashboard:', socket.id);
      });
    });
  }

  // Método estático que será llamado por el CU-08/09 cuando el sistema detecte un evento crítico
  public static emitirNuevaAlerta(medicoId: string, alerta: any) {
    if (DashboardController.io) {
      DashboardController.io.to(medicoId).emit('nueva_alerta', alerta);
    }
  }

  obtenerDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = new FiltroPacienteDto();
      // En un sistema real, medicoId vendría del token JWT en middleware
      dto.medicoId = req.query.medicoId as string || req.body.medicoId;
      dto.busqueda = req.query.busqueda as string;

      const resultado = await this.service.obtenerDashboard(dto);
      res.status(200).json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
