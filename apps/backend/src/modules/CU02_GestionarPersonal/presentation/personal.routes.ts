// Archivo de rutas para el caso de uso Gestionar Cuentas de Personal (CU-02)
// Define los endpoints relacionados con la gestión de personal (ej. POST /personal, GET /personal, PUT /personal/:id)
// Mapea las solicitudes HTTP hacia el controlador correspondiente.

import { Router } from 'express';
import { PersonalController } from './personal.controller';

const router = Router();
const controller = new PersonalController();

router.post('/', (req: any, res: any) => controller.crear(req, res));
router.get('/', (req: any, res: any) => controller.listar(req, res));
router.put('/:id', (req: any, res: any) => controller.actualizar(req, res));
router.delete('/:id', (req: any, res: any) => controller.deshabilitar(req, res));

export default router;
