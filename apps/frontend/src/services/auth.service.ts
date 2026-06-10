export interface Usuario {
  id: string;
  codigo: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  especialidad?: string;
  rol: {
    id: number;
    nombre: 'ADMIN' | 'MEDICO';
    permisos: string[];
    recursos: Array<{
      nombre: string;
      ruta: string;
    }>;
  };
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

const API_URL = 'http://localhost:3000/api';

export const AuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Credenciales inválidas');
    }

    const data: AuthResponse = await response.json();
    
    // Guardar en localStorage
    localStorage.setItem('padomi_token', data.token);
    localStorage.setItem('padomi_usuario', JSON.stringify(data.usuario));

    return data;
  },

  logout(): void {
    localStorage.removeItem('padomi_token');
    localStorage.removeItem('padomi_usuario');
  },

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('padomi_usuario');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('padomi_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
