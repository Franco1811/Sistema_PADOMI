const BACKEND_URL = 'http://localhost:3000';

export interface Metrica {
  id: string;
  codigo: string;
  nombre: string;
  unidad: string;
  descripcion: string;
  rangoMin: number;
  rangoMax: number;
}

export const MetricasService = {
  async listar(token: string): Promise<Metrica[]> {
    const res = await fetch(`${BACKEND_URL}/api/metricas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al listar métricas: ${res.statusText}`);
    }
    return await res.json();
  },

  async crear(data: Omit<Metrica, 'id' | 'codigo'>, token: string): Promise<Metrica> {
    const res = await fetch(`${BACKEND_URL}/api/metricas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Error al crear métrica: ${res.statusText}`);
    }
    return await res.json();
  },

  async actualizar(id: string, data: Partial<Omit<Metrica, 'id' | 'codigo'>>, token: string): Promise<Metrica> {
    const res = await fetch(`${BACKEND_URL}/api/metricas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Error al actualizar métrica: ${res.statusText}`);
    }
    return await res.json();
  },

  async eliminar(id: string, token: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/metricas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: null }));
      throw new Error(errData.error || `Error al eliminar métrica: ${res.statusText}`);
    }
  }
};

