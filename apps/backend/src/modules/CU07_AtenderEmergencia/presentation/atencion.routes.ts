import { Router } from 'express';
import { AtencionController } from './atencion.controller';

const router = Router();
const controller = new AtencionController();

// POST /alertas/:id/atender
router.post('/:id/atender', controller.atenderAlerta);

export default router;
