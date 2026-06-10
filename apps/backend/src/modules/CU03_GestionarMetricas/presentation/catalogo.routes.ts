// Archivo de rutas para el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Define los endpoints para crear, listar y editar métricas clínicas (ej. POST /catalogo, GET /catalogo).
// Mapea las solicitudes HTTP hacia el controlador correspondiente.

import { Router } from 'express';
import { CatalogoController } from './catalogo.controller';
import { autenticarToken } from '../../../middleware/auth.middleware';
import { autorizarRoles } from '../../../middleware/role.middleware';

const router = Router();
const controller = new CatalogoController();

// Permitir listar a cualquier personal autenticado (Administradores y Médicos)
router.get('/', autenticarToken, autorizarRoles('ADMIN', 'MEDICO'), (req: any, res: any) => controller.listar(req, res));

// Solo los Administradores pueden modificar el catálogo de métricas
router.post('/', autenticarToken, autorizarRoles('ADMIN'), (req: any, res: any) => controller.crear(req, res));
router.put('/:id', autenticarToken, autorizarRoles('ADMIN'), (req: any, res: any) => controller.actualizar(req, res));
router.delete('/:id', autenticarToken, autorizarRoles('ADMIN'), (req: any, res: any) => controller.eliminar(req, res));

export default router;
