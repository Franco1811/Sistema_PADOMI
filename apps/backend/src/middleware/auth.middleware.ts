import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO';
  };
}

export const autenticarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    return;
  }

  try {
    const secreto = process.env.JWT_SECRET || 'secret';
    const verificado = jwt.verify(token, secreto) as any;
    req.user = verificado;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
