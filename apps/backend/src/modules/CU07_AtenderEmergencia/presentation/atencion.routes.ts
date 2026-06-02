import { Router } from 'express';
import { AtencionController } from './atencion.controller';

const router = Router();
const controller = new AtencionController();

// GET /alertas/paciente/:pacienteId
router.get('/paciente/:pacienteId', controller.obtenerAlertasActivas);

// POST /alertas/:id/atender
router.post('/:id/atender', controller.atenderAlerta);

export default router;
