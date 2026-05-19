import { Router } from 'express';
import { GestionarPerfilController } from './gestionar-perfil.controller';

const router = Router();
const controller = new GestionarPerfilController();

router.get('/:id', controller.obtenerPerfil);
router.patch('/:id', controller.actualizarPerfil);

export default router;
