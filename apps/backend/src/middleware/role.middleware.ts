import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const autorizarRoles = (...rolesPermitidos: ('MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Acceso denegado: No autenticado' });
      return;
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      res.status(403).json({ error: `Acceso denegado: Se requiere rol ${rolesPermitidos.join(' o ')}` });
      return;
    }

    next();
  };
};
