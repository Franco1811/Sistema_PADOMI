// Controlador para el caso de uso Iniciar Sesión (CU-01)
// Recibe las solicitudes de inicio de sesión, valida el request y delega la lógica al servicio de aplicación.
// Retorna el token JWT si la autenticación es exitosa o un error si falla.

import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/login.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = new LoginDto();
      dto.email = req.body.email;
      dto.password = req.body.password;

      const result = await this.authService.login(dto);

      res.status(200).json(result);
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : 'Error de autenticación';
      if (msg.includes('cadenas de texto') || msg.includes('inválido') || msg.includes('caracteres')) {
        res.status(400).json({ error: msg });
        return;
      }
      res.status(401).json({ error: msg });
    }
  }
}
