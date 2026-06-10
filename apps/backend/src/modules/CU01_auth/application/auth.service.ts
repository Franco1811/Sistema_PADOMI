// Servicio de aplicación para el caso de uso Iniciar Sesión (CU-01)
// Orquesta el proceso de autenticación: consulta el repositorio, valida credenciales y genera el token de acceso.

import { IUsuarioRepository } from '../../../../../../shared/domain/interface/usuario.interface';
import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private usuarioRepository: IUsuarioRepository;

  constructor() {
    this.usuarioRepository = repositoryFactory.getUsuarioRepository();
  }

  async login(dto: LoginDto): Promise<{ token: string; usuario: any }> {
    dto.validar();

    const usuario = await this.usuarioRepository.buscarPorEmail(dto.email);

    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }

    if (!usuario.estaHabilitado()) {
      throw new Error("Cuenta deshabilitada");
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);

    if (!passwordValida) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol.nombre,
        permisos: usuario.rol.permisos,
        recursos: usuario.rol.recursos 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    const usuarioSinPassword = {
      id: usuario.id,
      codigo: usuario.codigo,
      dni: usuario.dni,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      especialidad: usuario.especialidad ? (typeof usuario.especialidad === 'string' ? usuario.especialidad : usuario.especialidad.nombre) : undefined,
      estaHabilitado: () => usuario.estaHabilitado()
    };

    return { token, usuario: usuarioSinPassword };
  }
}
