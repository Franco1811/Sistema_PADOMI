// Archivo de rutas para el caso de uso Iniciar Sesión (CU-01)
// Define los endpoints relacionados con la autenticación de usuarios (ej. POST /auth/login)
// Mapea las solicitudes HTTP hacia el controlador correspondiente.

import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', (req: any, res: any) => authController.login(req, res));

export default router;
