import { Router } from 'express';
import { IngestaController } from './ingesta.controller';

const router = Router();
const controller = new IngestaController();

// POST /ingesta
router.post('/', controller.recibirIngesta);

export default router;
