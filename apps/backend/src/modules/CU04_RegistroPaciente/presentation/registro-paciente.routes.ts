// Rutas para CU-04 (Registrar Paciente Crónico)
// Solo define la ruta POST /pacientes

import { Router } from 'express';
import { RegistroPacienteController } from './registro-paciente.controller';

const router = Router();
const controller = new RegistroPacienteController();

router.post('/pacientes', (req: any, res: any) => controller.registrar(req, res));

export default router;
