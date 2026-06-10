// Archivo de rutas para el Dashboard Clínico
// Utilizado en CU-06 (Monitorear Dashboard Clínico)
// Define el acceso al panel principal del médico.
// Mapea las solicitudes HTTP hacia el controlador correspondiente.

import { Router } from 'express';
import { DashboardController } from './dashboard.controller';

const router = Router();
const controller = new DashboardController();

// GET /dashboard/medico-demo
router.get('/medico-demo', controller.obtenerMedicoDemo);

// GET /dashboard/kpis?medicoId=UUID
router.get('/kpis', controller.obtenerKPIs);

// GET /dashboard?medicoId=UUID&busqueda=texto
router.get('/', controller.obtenerDashboard);

export default router;
