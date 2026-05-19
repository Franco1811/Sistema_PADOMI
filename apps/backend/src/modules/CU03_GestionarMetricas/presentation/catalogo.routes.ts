// Archivo de rutas para el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Define los endpoints para crear, listar y editar métricas clínicas (ej. POST /catalogo, GET /catalogo).
// Mapea las solicitudes HTTP hacia el controlador correspondiente.

import { Router } from 'express';
import { CatalogoController } from './catalogo.controller';

const router = Router();
const controller = new CatalogoController();

router.post('/catalogo', (req: any, res: any) => controller.crear(req, res));
router.get('/catalogo', (req: any, res: any) => controller.listar(req, res));
router.put('/catalogo/:id', (req: any, res: any) => controller.actualizar(req, res));
router.delete('/catalogo/:id', (req: any, res: any) => controller.eliminar(req, res));

export default router;
