// Controlador para CU-04 (Registrar Paciente Crónico)
// Recibe el nuevo paciente y delega la lógica al servicio de aplicación

import { Request, Response } from 'express';
import { RegistrarPacienteService } from '../application/registrar-paciente.service';
import { PacienteDto } from '../application/paciente.dto';

export class RegistroPacienteController {
  private service: RegistrarPacienteService;

  constructor() {
    this.service = new RegistrarPacienteService();
  }

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const dto = new PacienteDto();
      dto.dni = req.body.dni;
      dto.nombres = req.body.nombres;
      dto.edad = req.body.edad;
      dto.diagnostico = req.body.diagnostico;
      dto.medicoAsignadoId = req.body.medicoAsignadoId;
      dto.telefono = req.body.telefono;
      dto.direccion = req.body.direccion;

      const paciente = await this.service.registrarPaciente(dto);
      res.status(201).json(paciente);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al registrar paciente' });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
  try {
    const pacientes = await this.service.listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error al listar pacientes' });
  }
}



}
