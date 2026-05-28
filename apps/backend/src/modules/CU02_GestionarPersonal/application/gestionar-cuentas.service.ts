// Servicio de aplicación para el caso de uso Gestionar Cuentas de Personal (CU-02)
// Orquesta la lógica administrativa: verifica existencia de DNI, cifra contraseñas y solicita guardar.
// Puede reutilizar lógica de validación de otros servicios.

import { IUsuarioRepository } from '../../../../../../shared/domain/repositories/usuario.interface';
import { UsuarioRepository } from '../../../../../../shared/infrastructure/repositories/usuario.repository';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { RegistroPersonalDto } from './registro-personal.dto';
import * as bcrypt from 'bcrypt';

export class GestionarCuentasService {
  private usuarioRepository: IUsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async crearPersonal(dto: RegistroPersonalDto): Promise<Usuario> {
    dto.validar();

    const existe = await this.usuarioRepository.buscarPorDni(dto.dni);
    if (existe) {
      throw new Error("El DNI ya está registrado");
    }

    const existeEmail = await this.usuarioRepository.buscarPorEmail(dto.email);
    if (existeEmail) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const codigoGenerado = await this.usuarioRepository.generarCodigo();

    const usuario = new Usuario(
      crypto.randomUUID(),  //funcion nativa de node.js para generar UUIDs 
      codigoGenerado,
      dto.dni,
      dto.nombre,
      dto.apellido,
      dto.email,
      passwordHash,
      dto.rol,
      true,
      dto.especialidad
    );

    return await this.usuarioRepository.guardar(usuario);
  }

  async listarPersonal(especialidad?: string): Promise<Usuario[]> {
    return await this.usuarioRepository.listarTodos(especialidad);
  }

  async actualizarPersonal(id: string, dto: Partial<RegistroPersonalDto>): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizar campos si se proporcionan
    if (dto.email && dto.email !== usuario.email) {
      const existeEmail = await this.usuarioRepository.buscarPorEmail(dto.email);
      if (existeEmail) {
        throw new Error("El correo electrónico ya está registrado por otro usuario");
      }
    }

    const nombre = dto.nombre || usuario.nombre;
    const apellido = dto.apellido || usuario.apellido;
    const email = dto.email || usuario.email;
    const rol = dto.rol || usuario.rol;
    const especialidad = dto.especialidad !== undefined ? dto.especialidad : usuario.especialidad;

    const usuarioActualizado = new Usuario(
      usuario.id,
      usuario.codigo,
      usuario.dni,
      nombre,
      apellido,
      email,
      usuario.passwordHash,
      rol,
      usuario.activo,
      especialidad
    );

    return await this.usuarioRepository.actualizar(usuarioActualizado);
  }

  async deshabilitarPersonal(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // RNF-34: El modelo lógico contiene un bloqueo estricto anti-auto-desactivación,
    // impidiendo que el último Administrador activo sea desactivado del sistema.
    if (usuario.rol === 'ADMINISTRATIVO' && usuario.activo) {
      const todos = await this.usuarioRepository.listarTodos();
      const adminsActivos = todos.filter(u => u.rol === 'ADMINISTRATIVO' && u.activo);
      if (adminsActivos.length <= 1) {
        throw new Error("Operación no permitida: No se puede desactivar al único Administrador activo del sistema");
      }
    }

    const usuarioDeshabilitado = new Usuario(
      usuario.id,
      usuario.codigo,
      usuario.dni,
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      usuario.passwordHash,
      usuario.rol,
      false, // Desactivado
      usuario.especialidad
    );

    return await this.usuarioRepository.actualizar(usuarioDeshabilitado);
  }
}
