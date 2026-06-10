const BACKEND_URL = 'http://localhost:3000';

export interface PersonalAccount {
  id: string;
  codigo: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: {
    id: number;
    nombre: 'ADMIN' | 'MEDICO';
  };
  activo: boolean;
  especialidad?: {
    id: number;
    nombre: string;
  } | string;
}

export interface CrearPersonalInput {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: string; // 'ADMIN' o 'MEDICO'
  especialidad?: string; // e.g., 'Geriatría'
}

export const PersonalService = {
  async listar(token: string, especialidad?: string): Promise<PersonalAccount[]> {
    const url = especialidad 
      ? `${BACKEND_URL}/api/personal?especialidad=${encodeURIComponent(especialidad)}`
      : `${BACKEND_URL}/api/personal`;
      
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Error al listar personal: ${res.statusText}`);
    }
    return await res.json();
  },

  async crear(data: CrearPersonalInput, token: string): Promise<PersonalAccount> {
    const res = await fetch(`${BACKEND_URL}/api/personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Error al crear personal: ${res.statusText}`);
    }
    return await res.json();
  },

  async actualizar(id: string, data: Partial<CrearPersonalInput>, token: string): Promise<PersonalAccount> {
    const res = await fetch(`${BACKEND_URL}/api/personal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Error al actualizar personal: ${res.statusText}`);
    }
    return await res.json();
  },

  async deshabilitar(id: string, token: string): Promise<PersonalAccount> {
    const res = await fetch(`${BACKEND_URL}/api/personal/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Error al deshabilitar personal: ${res.statusText}`);
    }
    return await res.json();
  }
};
