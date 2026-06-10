import { Router } from 'express';
import { GestionarPerfilController } from './gestionar-perfil.controller';
import { autenticarToken } from '../../../middleware/auth.middleware';
import { autorizarRoles } from '../../../middleware/role.middleware';

const router = Router();
const controller = new GestionarPerfilController();

// GET /pacientes/perfil/:id
router.get('/:id', autenticarToken, autorizarRoles('ADMIN', 'MEDICO'), (req: any, res: any) => controller.obtenerPerfil(req, res));

// GET /pacientes/perfil/:id/lecturas
router.get('/:id/lecturas', autenticarToken, autorizarRoles('ADMIN', 'MEDICO'), (req: any, res: any) => controller.obtenerLecturas(req, res));

// PATCH /pacientes/perfil/:id
router.patch('/:id', autenticarToken, autorizarRoles('ADMIN', 'MEDICO'), (req: any, res: any) => controller.actualizarPerfil(req, res));

export default router;
