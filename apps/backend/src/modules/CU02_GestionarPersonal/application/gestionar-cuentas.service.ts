import { IUsuarioRepository } from '../../../../../../shared/domain/interface/usuario.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { Rol } from '../../../../../../shared/domain/entities/rol.entity';
import { Especialidad } from '../../../../../../shared/domain/entities/especialidad.entity';
import { UsuarioBuilder } from '../../../../../../shared/domain/builders/usuario.builder';
import { RegistroPersonalDto } from './registro-personal.dto';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../../../../../shared/infrastructure/data-source';
import { EspecialidadModel } from '../../../../../../shared/infrastructure/models/especialidad.model';

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

    const rolId = dto.rol === 'ADMIN' ? 1 : 2;
    const rolObj = new Rol(rolId, dto.rol);

    // Buscar especialidad en la base de datos
    let espObj: Especialidad | undefined = undefined;
    if (dto.especialidad) {
      const especialidadRepository = AppDataSource.getRepository(EspecialidadModel);
      const especialidadEncontrada = await especialidadRepository.findOne({
        where: { nombre: dto.especialidad }
      });
      
      if (especialidadEncontrada) {
        espObj = new Especialidad(especialidadEncontrada.id, especialidadEncontrada.nombre);
      } else {
        throw new Error(`Especialidad "${dto.especialidad}" no encontrada en la base de datos`);
      }
    }

    const usuario = new UsuarioBuilder()
      .conId(crypto.randomUUID())
      .conCodigo(codigoGenerado)
      .conDni(dto.dni)
      .conNombre(dto.nombre)
      .conApellido(dto.apellido)
      .conEmail(dto.email)
      .conPasswordHash(passwordHash)
      .conRol(rolObj)
      .conActivo(true)
      .conEspecialidad(espObj)
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

    if (dto.email && dto.email !== usuario.email) {
      const existeEmail = await this.usuarioRepository.buscarPorEmail(dto.email);
      if (existeEmail) {
        throw new Error("El correo electrónico ya está registrado por otro usuario");
      }
    }

    const nombre = dto.nombre || usuario.nombre;
    const apellido = dto.apellido || usuario.apellido;
    const email = dto.email || usuario.email;
    const rol = dto.rol ? new Rol(dto.rol === 'ADMIN' ? 1 : 2, dto.rol) : usuario.rol;
    
    let especialidad: Especialidad | undefined = usuario.especialidad;
    if (dto.especialidad !== undefined) {
      if (dto.especialidad) {
        const especialidadRepository = AppDataSource.getRepository(EspecialidadModel);
        const especialidadEncontrada = await especialidadRepository.findOne({
          where: { nombre: dto.especialidad }
        });
        
        if (!especialidadEncontrada) {
          throw new Error(`Especialidad "${dto.especialidad}" no encontrada`);
        }
        especialidad = new Especialidad(especialidadEncontrada.id, especialidadEncontrada.nombre);
      } else {
        especialidad = undefined;
      }
    }

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

    if (!usuario.activo) {
      return usuario;
    }

    if (usuario.rol.nombre === 'ADMIN' && usuario.activo) {
      const todos = await this.usuarioRepository.listarTodos();
      const adminsActivos = todos.filter(u => u.rol.nombre === 'ADMIN' && u.activo);
      if (adminsActivos.length <= 1) {
        throw new Error("Operación no permitida: No se puede desactivar al único Administrador activo del sistema");
      }
    }

    const usuarioDeshabilitado = usuario.clone({
      activo: false
    });

    return await this.usuarioRepository.actualizar(usuarioDeshabilitado);
  }
}