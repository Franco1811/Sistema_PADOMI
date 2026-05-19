// Repositorio compartido utilizado en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal).
// Define las operaciones de persistencia para usuarios.
// Se reutiliza en todos los casos de uso que requieran acceso a usuarios.

import { Usuario } from '../entities/usuario.entity';

export interface IUsuarioRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorDni(dni: string): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<Usuario>;
  actualizar(usuario: Usuario): Promise<Usuario>;
  listarTodos(especialidad?: string): Promise<Usuario[]>;
  buscarPorId(id: string): Promise<Usuario | null>;
  generarCodigo(): Promise<string>;
}
