const BACKEND_URL = 'http://localhost:3000';

export interface Alerta {
  id: string;
  codigo: string;
  pacienteId: string;
  lecturaId?: string;
  severidad: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  mensaje: string;
  fecha: string;
  atendida: boolean;
}

export const AlertasService = {
  async obtenerPorPaciente(pacienteId: string, token: string): Promise<Alerta[]> {
    const res = await fetch(`${BACKEND_URL}/api/alertas/paciente/${pacienteId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al obtener alertas del paciente: ${res.statusText}`);
    }
    return await res.json();
  },

  async atender(alertaId: string, medicoId: string, resumen: string, recomendaciones: string, token: string): Promise<boolean> {
    const res = await fetch(`${BACKEND_URL}/api/alertas/${alertaId}/atender`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ medicoId, resumen, recomendaciones })
    });
    return res.ok;
  }
};
