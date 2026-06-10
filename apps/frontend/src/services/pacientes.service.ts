const BACKEND_URL = 'http://localhost:3000';

export interface Paciente {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  edad: number;
  diagnostico: string;
  medicoId: string;
  telefono?: string;
  direccion?: string;
}

export interface Umbral {
  metricaId: string;
  valorMin: string | number;
  valorMax: string | number;
  metrica?: {
    id: string;
    nombre: string;
    unidad: string;
    rangoMin: number;
    rangoMax: number;
  };
}

export interface PacientePerfilResponse {
  paciente: Paciente;
  umbrales: Umbral[];
  enfermedades: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
  }[];
}

export const PacientesService = {
  async obtenerDashboard(medicoId: string, busqueda: string, pagina: number, token: string): Promise<any[]> {
    const res = await fetch(`${BACKEND_URL}/api/dashboard?medicoId=${medicoId}&busqueda=${busqueda}&page=${pagina}&limit=6`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al obtener pacientes del dashboard: ${res.statusText}`);
    }
    return await res.json();
  },

  async obtenerPerfil(pacienteId: string, token: string): Promise<PacientePerfilResponse> {
    const res = await fetch(`${BACKEND_URL}/api/pacientes/perfil/${pacienteId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al obtener perfil del paciente: ${res.statusText}`);
    }
    return await res.json();
  },

  async actualizarPerfil(pacienteId: string, payload: { telefono: string; direccion: string; umbrales: any[] }, token: string): Promise<Response> {
    return await fetch(`${BACKEND_URL}/api/pacientes/perfil/${pacienteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  },

  async obtenerLecturas(pacienteId: string, token: string, limit: number = 20): Promise<any[]> {
    const res = await fetch(`${BACKEND_URL}/api/pacientes/perfil/${pacienteId}/lecturas?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al obtener lecturas del paciente: ${res.statusText}`);
    }
    return await res.json();
  },

  async obtenerKPIs(medicoId: string, token: string): Promise<{ totalPacientes: number; alertasCriticasHoy: number }> {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/kpis?medicoId=${medicoId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al obtener KPIs del médico: ${res.statusText}`);
    }
    return await res.json();
  }
};
