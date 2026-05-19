// Controlador para el caso de uso Gestionar Cuentas de Personal (CU-02)
// Recibe las solicitudes del administrador, delega la lógica al servicio de aplicación y retorna la respuesta.
// No contiene lógica de negocio, solo gestiona la entrada y salida de la API.

import { Request, Response } from 'express';
import { GestionarCuentasService } from '../application/gestionar-cuentas.service';
import { RegistroPersonalDto } from '../application/registro-personal.dto';

export class PersonalController {
  private service: GestionarCuentasService;

  constructor() {
    this.service = new GestionarCuentasService();
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const dto = new RegistroPersonalDto();
      dto.nombre = req.body.nombre;
      dto.apellido = req.body.apellido;
      dto.email = req.body.email;
      dto.password = req.body.password;
      dto.rol = req.body.rol;
      dto.especialidad = req.body.especialidad;

      const usuario = await this.service.crearPersonal(dto);
      const { passwordHash, ...usuarioSinPassword } = usuario;

      res.status(201).json(usuarioSinPassword);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al crear personal' });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const especialidad = req.query.especialidad as string | undefined;
      const usuarios = await this.service.listarPersonal(especialidad);

      const usuariosSinPassword = usuarios.map(u => {
        const { passwordHash, ...rest } = u;
        return rest;
      });

      res.status(200).json(usuariosSinPassword);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Error al listar personal' });
    }
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const dto: Partial<RegistroPersonalDto> = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        rol: req.body.rol,
        especialidad: req.body.especialidad
      };

      const usuario = await this.service.actualizarPersonal(idStr, dto);
      const { passwordHash, ...usuarioSinPassword } = usuario;

      res.status(200).json(usuarioSinPassword);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al actualizar personal' });
    }
  }
}
