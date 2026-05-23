import { Router } from 'express';
import { GestionarPerfilController } from './gestionar-perfil.controller';
import { autenticarToken } from '../../../middleware/auth.middleware';
import { autorizarRoles } from '../../../middleware/role.middleware';

const router = Router();
const controller = new GestionarPerfilController();

router.get('/:id', autenticarToken, autorizarRoles('ADMINISTRATIVO', 'MEDICO', 'ENFERMERO'), (req: any, res: any) => controller.obtenerPerfil(req, res));
router.patch('/:id', autenticarToken, autorizarRoles('ADMINISTRATIVO', 'MEDICO'), (req: any, res: any) => controller.actualizarPerfil(req, res));

export default router;
