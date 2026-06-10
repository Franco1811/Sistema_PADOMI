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
  }
};
