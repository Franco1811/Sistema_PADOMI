import { Router } from 'express';
import { RegistroPacienteController } from './registro-paciente.controller';
import { autenticarToken } from '../../../middleware/auth.middleware';
import { autorizarRoles } from '../../../middleware/role.middleware';

const router = Router();
const controller = new RegistroPacienteController();

// GET - Listar todos los pacientes (solo ADMIN)
router.get('/', autenticarToken, autorizarRoles('ADMIN'), (req: any, res: any) => controller.listar(req, res));

// POST - Registrar paciente
router.post('/', autenticarToken, autorizarRoles('ADMIN', 'MEDICO'), (req: any, res: any) => controller.registrar(req, res));

export default router;