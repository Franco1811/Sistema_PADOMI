import { SELENIUM_CONFIG } from '../config/selenium.config';

export interface DisparoIoTResultado {
  pacienteId: string;
  pacienteNombre: string;
  metricaId: string;
  metricaNombre: string;
  valorEnviado: number;
  lecturaCodigo: string;
}

/**
 * Servicio auxiliar para simular el envío de un paquete biométrico crítico
 * desde un dispositivo IoT hacia POST /api/ingesta (CU-08 / CU-09),
 * provocando que el Motor de Reglas dispare una alerta por WebSockets al navegador.
 */
export class IoTSimulatorHelper {
  static async dispararPulsoCriticoEnVivo(): Promise<DisparoIoTResultado> {
    // 1. Autenticar como médico para consultar su cartera real de pacientes y métricas
    const loginRes = await fetch(`${SELENIUM_CONFIG.BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(SELENIUM_CONFIG.CREDENCIALES.MEDICO)
    });
    const loginData: any = await loginRes.json();
    const token = loginData.token;
    const medicoId = loginData.usuario?.id || '99999999-9999-9999-9999-999999999999';

    // 2. Obtener pacientes asignados al médico
    const pacRes = await fetch(`${SELENIUM_CONFIG.BACKEND_API_URL}/pacientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const pacientes: any[] = await pacRes.json();
    const pacienteMedico =
      pacientes.find((p) => String(p.medicoAsignadoId).toLowerCase() === String(medicoId).toLowerCase()) ||
      pacientes[0];

    if (!pacienteMedico) {
      throw new Error('No se encontraron pacientes crónicos asignados para simular telemetría IoT.');
    }

    // 3. Obtener una métrica activa del catálogo
    const metRes = await fetch(`${SELENIUM_CONFIG.BACKEND_API_URL}/metricas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const metricas: any[] = await metRes.json();
    const metrica = metricas[0];

    if (!metrica) {
      throw new Error('No existen métricas registradas en el catálogo para asociar la lectura IoT.');
    }

    // Calculamos un valor crítico que supere ampliamente el margen del 10% (rangoMax * 1.1)
    const valorCritico = Math.round((Number(metrica.rangoMax || 100) * 1.35 + 15) * 10) / 10;

    // 4. Inyectar paquete biométrico al endpoint de Ingesta IoT (CU-08)
    const ingestaRes = await fetch(`${SELENIUM_CONFIG.BACKEND_API_URL}/ingesta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pacienteId: pacienteMedico.id,
        metricaId: metrica.id,
        valor: valorCritico
      })
    });

    if (!ingestaRes.ok) {
      const errText = await ingestaRes.text();
      throw new Error(`Error al inyectar telemetría IoT: ${errText}`);
    }

    const lecturaCreada: any = await ingestaRes.json();

    return {
      pacienteId: pacienteMedico.id,
      pacienteNombre: pacienteMedico.nombres,
      metricaId: metrica.id,
      metricaNombre: metrica.nombre,
      valorEnviado: valorCritico,
      lecturaCodigo: lecturaCreada.codigo
    };
  }
}

