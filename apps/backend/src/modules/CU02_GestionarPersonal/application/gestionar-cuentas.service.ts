// Servicio de aplicación para el caso de uso Gestionar Cuentas de Personal (CU-02)
// Orquesta la lógica administrativa: verifica existencia de DNI, cifra contraseñas y solicita guardar.
// Puede reutilizar lógica de validación de otros servicios.

import { IUsuarioRepository } from '../../../../../../shared/domain/interface/usuario.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { UsuarioBuilder } from '../../../../../../shared/domain/builders/usuario.builder';
import { RegistroPersonalDto } from './registro-personal.dto';
import * as bcrypt from 'bcrypt';

export class GestionarCuentasService {
  private usuarioRepository: IUsuarioRepository;

  constructor() {
    this.usuarioRepository = repositoryFactory.getUsuarioRepository();
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

    const usuario = new UsuarioBuilder()
      .conId(crypto.randomUUID())
      .conCodigo(codigoGenerado)
      .conDni(dto.dni)
      .conNombre(dto.nombre)
      .conApellido(dto.apellido)
      .conEmail(dto.email)
      .conPasswordHash(passwordHash)
      .conRol(dto.rol)
      .conActivo(true)
      .conEspecialidad(dto.especialidad)
      .build();

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

    const usuarioActualizado = usuario.clone({
      nombre,
      apellido,
      email,
      rol,
      especialidad
    });

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

    const usuarioDeshabilitado = usuario.clone({
      activo: false // Desactivado
    });

    return await this.usuarioRepository.actualizar(usuarioDeshabilitado);
  }
}
