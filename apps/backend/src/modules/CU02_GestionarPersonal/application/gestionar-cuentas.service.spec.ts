/// <reference path="../../../types/jest.d.ts" />
/**
 * PRUEBAS UNITARIAS - CASO DE USO CU-02: GESTIONAR CUENTAS DE PERSONAL
 * Framework: Jest / TypeScript
 * Curso: Calidad y Pruebas de Software
 * 
 * Alcance: Validación de reglas de negocio en la capa de servicios (GestionarCuentasService)
 * y validaciones del DTO de entrada (RegistroPersonalDto), aislando la persistencia mediante Mocks.
 */

import { GestionarCuentasService } from './gestionar-cuentas.service';
import { RegistroPersonalDto } from './registro-personal.dto';
import { IUsuarioRepository } from '../../../../../../shared/domain/interface/usuario.interface';
import { IPacienteRepository } from '../../../../../../shared/domain/interface/paciente.interface';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { Rol } from '../../../../../../shared/domain/entities/rol.entity';
import { Especialidad } from '../../../../../../shared/domain/entities/especialidad.entity';

describe('CU-02: Gestionar Cuentas de Personal - Pruebas Unitarias', () => {
  let mockUsuarioRepository: jest.Mocked<IUsuarioRepository>;
  let mockPacienteRepository: jest.Mocked<IPacienteRepository>;
  let mockFindEspecialidad: jest.Mock;
  let service: GestionarCuentasService;

  beforeEach(() => {
    // Configuración de dobles de prueba (Mocks) para aislar la base de datos PostgreSQL
    mockUsuarioRepository = {
      buscarPorDni: jest.fn(),
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
      guardar: jest.fn(),
      actualizar: jest.fn(),
      listarTodos: jest.fn(),
      generarCodigo: jest.fn()
    };

    mockPacienteRepository = {
      contarPorMedicoAsignado: jest.fn(),
      listarPorMedicoAsignado: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorDni: jest.fn(),
      guardar: jest.fn(),
      actualizar: jest.fn(),
      listarTodos: jest.fn(),
      generarCodigo: jest.fn()
    };

    mockFindEspecialidad = jest.fn();

    // Inyección de dependencias mockeadas en el servicio bajo prueba
    service = new GestionarCuentasService(
      mockUsuarioRepository,
      mockPacienteRepository,
      mockFindEspecialidad
    );
  });

  describe('Creación de Personal (GestionarCuentasService.crearPersonal)', () => {
    // UT-01: Caso de Éxito (Flujo Feliz)
    it('UT-01: Debe registrar exitosamente a un nuevo médico cuando los datos son válidos y únicos', async () => {
      // 1. Arrange (Preparar datos y comportamiento de los mocks)
      const dto = new RegistroPersonalDto();
      dto.dni = '70415264';
      dto.nombre = 'Franco';
      dto.apellido = 'Gonzalez';
      dto.email = 'franco.gonzalez@essalud.gob.pe';
      dto.password = 'ClaveSegura#2026';
      dto.rol = 'MEDICO';
      dto.especialidad = 'Geriatría';

      mockUsuarioRepository.buscarPorDni.mockResolvedValue(null); // DNI no existe previamente
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null); // Email no existe previamente
      mockUsuarioRepository.generarCodigo.mockResolvedValue('USU-0005');
      mockFindEspecialidad.mockResolvedValue(new Especialidad(2, 'Geriatría'));

      // Simular persistencia exitosa retornando el usuario construido
      mockUsuarioRepository.guardar.mockImplementation(async (u) => u);

      // 2. Act (Ejecutar la función bajo prueba)
      const resultado = await service.crearPersonal(dto);

      // 3. Assert (Verificar resultados)
      expect(resultado).toBeDefined();
      expect(resultado.dni).toBe('70415264');
      expect(resultado.codigo).toBe('USU-0005');
      expect(resultado.email).toBe('franco.gonzalez@essalud.gob.pe');
      expect(resultado.rol.nombre).toBe('MEDICO');
      expect(resultado.especialidad?.nombre).toBe('Geriatría');
      expect(resultado.activo).toBe(true);
      expect(mockUsuarioRepository.guardar).toHaveBeenCalledTimes(1);
    });

    // UT-02: Caso Fallido - Colisión de DNI existente
    it('UT-02: Debe rechazar el registro y lanzar excepción si el DNI ya está registrado', async () => {
      // 1. Arrange
      const dto = new RegistroPersonalDto();
      dto.dni = '70415264';
      dto.nombre = 'Franco';
      dto.apellido = 'Gonzalez';
      dto.email = 'franco.nuevo@essalud.gob.pe';
      dto.password = 'ClaveSegura#2026';
      dto.rol = 'MEDICO';
      dto.especialidad = 'Geriatría';

      const usuarioExistente = new Usuario(
        'uuid-1234',
        'USU-0001',
        '70415264',
        'Franco',
        'Gonzalez',
        'franco.anterior@essalud.gob.pe',
        'hash123',
        new Rol(2, 'MEDICO'),
        true,
        new Especialidad(2, 'Geriatría')
      );
      mockUsuarioRepository.buscarPorDni.mockResolvedValue(usuarioExistente);

      // 2. Act & 3. Assert
      await expect(service.crearPersonal(dto)).rejects.toThrow('El DNI ya está registrado');
      expect(mockUsuarioRepository.guardar).not.toHaveBeenCalled();
    });

    // UT-03: Caso Fallido - Duplicidad de Correo Electrónico
    it('UT-03: Debe rechazar el registro si el correo institucional ya pertenece a otra cuenta', async () => {
      // 1. Arrange
      const dto = new RegistroPersonalDto();
      dto.dni = '70415265';
      dto.nombre = 'Carlos';
      dto.apellido = 'Mendoza';
      dto.email = 'carlos.mendoza@essalud.gob.pe';
      dto.password = 'ClaveSegura#2026';
      dto.rol = 'MEDICO';
      dto.especialidad = 'Cardiología';

      mockUsuarioRepository.buscarPorDni.mockResolvedValue(null);
      const usuarioConMismoEmail = new Usuario(
        'uuid-5678',
        'USU-0002',
        '45812048',
        'Carlos',
        'Mendoza',
        'carlos.mendoza@essalud.gob.pe',
        'hash456',
        new Rol(2, 'MEDICO'),
        true,
        new Especialidad(1, 'Cardiología')
      );
      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(usuarioConMismoEmail);

      // 2. Act & 3. Assert
      await expect(service.crearPersonal(dto)).rejects.toThrow('El correo electrónico ya está registrado');
      expect(mockUsuarioRepository.guardar).not.toHaveBeenCalled();
    });
  });

  describe('Validación de Formato de Datos de Entrada (RegistroPersonalDto)', () => {
    // UT-04: Caso Fallido - Validación de DNI
    it('UT-04: Debe rechazar el registro si el DNI no cumple con el estándar de 8 dígitos numéricos', () => {
      const dto = new RegistroPersonalDto();
      dto.dni = '70415A'; // Longitud incorrecta y contiene caracteres alfabéticos
      dto.nombre = 'Franco';
      dto.apellido = 'Gonzalez';
      dto.email = 'franco@essalud.gob.pe';
      dto.password = 'ClaveSegura#2026';
      dto.rol = 'MEDICO';
      dto.especialidad = 'Geriatría';

      expect(() => dto.validar()).toThrow('DNI inválido');
    });

    // UT-05: Caso Fallido - Política de Contraseña Segura
    it('UT-05: Debe rechazar contraseñas débiles que no cumplan requisitos de seguridad', () => {
      const dto = new RegistroPersonalDto();
      dto.dni = '70415264';
      dto.nombre = 'Franco';
      dto.apellido = 'Gonzalez';
      dto.email = 'franco@essalud.gob.pe';
      dto.password = '12345'; // Menos de 8 caracteres, sin mayúscula ni símbolo
      dto.rol = 'MEDICO';
      dto.especialidad = 'Geriatría';

      expect(() => dto.validar()).toThrow(
        'La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo'
      );
    });

    // UT-06: Caso Fallido - Regla de Especialidad para Médicos
    it('UT-06: Debe rechazar el registro si el rol es MEDICO pero no se especifica una especialidad', () => {
      const dto = new RegistroPersonalDto();
      dto.dni = '70415264';
      dto.nombre = 'Franco';
      dto.apellido = 'Gonzalez';
      dto.email = 'franco@essalud.gob.pe';
      dto.password = 'ClaveSegura#2026';
      dto.rol = 'MEDICO';
      dto.especialidad = undefined; // Omisión de campo mandatorio para médicos

      expect(() => dto.validar()).toThrow('Médico debe tener especialidad');
    });
  });

  describe('Reglas de Negocio en Deshabilitación de Cuentas (deshabilitarPersonal)', () => {
    // UT-07: Caso Fallido - Protección del Último Administrador del Sistema
    it('UT-07: Debe bloquear la desactivación del único Administrador activo del sistema', async () => {
      const adminId = 'admin-uuid-1';
      const adminUsuario = new Usuario(
        adminId,
        'USU-0001',
        '72839401',
        'Admin',
        'PADOMI',
        'admin@essalud.gob.pe',
        'hash',
        new Rol(1, 'ADMIN'),
        true
      );

      mockUsuarioRepository.buscarPorId.mockResolvedValue(adminUsuario);
      // Simular que en la BD solo hay 1 administrador activo
      mockUsuarioRepository.listarTodos.mockResolvedValue([adminUsuario]);

      await expect(service.deshabilitarPersonal(adminId)).rejects.toThrow(
        'Operación no permitida: No se puede desactivar al único Administrador activo del sistema'
      );
      expect(mockUsuarioRepository.actualizar).not.toHaveBeenCalled();
    });

    // UT-08: Caso Fallido - Protección de Pacientes Asignados a un Médico
    it('UT-08: Debe impedir deshabilitar a un médico que tiene pacientes activos asignados', async () => {
      const medicoId = 'medico-uuid-2';
      const medicoUsuario = new Usuario(
        medicoId,
        'USU-0002',
        '45812048',
        'Carlos',
        'Mendoza',
        'carlos@essalud.gob.pe',
        'hash',
        new Rol(2, 'MEDICO'),
        true,
        new Especialidad(2, 'Geriatría')
      );

      mockUsuarioRepository.buscarPorId.mockResolvedValue(medicoUsuario);
      // El repositorio de pacientes reporta que el médico tiene 3 pacientes a cargo
      mockPacienteRepository.contarPorMedicoAsignado.mockResolvedValue(3);

      await expect(service.deshabilitarPersonal(medicoId)).rejects.toThrow(
        'No se puede deshabilitar al médico porque tiene pacientes vigentes asignados'
      );
      expect(mockUsuarioRepository.actualizar).not.toHaveBeenCalled();
    });
  });
});
