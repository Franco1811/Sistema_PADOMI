import { DatabaseConnection } from '../../../shared/infrastructure/data-source';
import { RolModel } from '../../../shared/infrastructure/models/rol.model';
import { PermisoModel } from '../../../shared/infrastructure/models/permiso.model';
import { EspecialidadModel } from '../../../shared/infrastructure/models/especialidad.model';
import { UsuarioModel } from '../../../shared/infrastructure/models/usuario.model';
import { PacienteModel } from '../../../shared/infrastructure/models/paciente.model';
import { MetricaModel } from '../../../shared/infrastructure/models/metrica.model';
import { EnfermedadCronicaModel } from '../../../shared/infrastructure/models/enfermedad-cronica.model';
import { UmbralModel } from '../../../shared/infrastructure/models/umbral.model';
import { PacienteEnfermedadModel } from '../../../shared/infrastructure/models/paciente-enfermedad.model';

export class DatabaseSeeder {
  static async seed(): Promise<void> {
    const dataSource = DatabaseConnection.getInstance().getDataSource();
    const usuarioRepo = dataSource.getRepository(UsuarioModel);

    // 1. Verificar si ya existen usuarios. Si existen, no sembramos nada.
    const count = await usuarioRepo.count();
    if (count > 0) {
      console.log('[Seeder] La base de datos ya contiene datos. Omitiendo siembra.');
      return;
    }

    console.log('[Seeder] Base de datos vacía detectada. Iniciando siembra de datos semilla...');

    // Repositorios
    const rolRepo = dataSource.getRepository(RolModel);
    const permisoRepo = dataSource.getRepository(PermisoModel);
    const especialidadRepo = dataSource.getRepository(EspecialidadModel);
    const pacienteRepo = dataSource.getRepository(PacienteModel);
    const metricaRepo = dataSource.getRepository(MetricaModel);
    const enfermedadRepo = dataSource.getRepository(EnfermedadCronicaModel);
    const pacienteEnfermedadRepo = dataSource.getRepository(PacienteEnfermedadModel);
    const umbralRepo = dataSource.getRepository(UmbralModel);

    // 2. Roles
    console.log('[Seeder] Sembrando Roles...');
    const adminRol = rolRepo.create({ id: 1, nombre: 'ADMIN' });
    const medicoRol = rolRepo.create({ id: 2, nombre: 'MEDICO' });
    await rolRepo.save([adminRol, medicoRol]);

    // 3. Permisos
    console.log('[Seeder] Sembrando Permisos...');
    const p1 = permisoRepo.create({ id: 1, nombre: 'atender_alerta', descripcion: 'Permite atender y emitir evaluaciones de alertas criticas' });
    const p2 = permisoRepo.create({ id: 2, nombre: 'monitorear_pacientes', descripcion: 'Permite la lectura del dashboard clínico interactivo en tiempo real' });
    const p3 = permisoRepo.create({ id: 3, nombre: 'gestionar_usuarios', descripcion: 'Permite la creacion, edicion y deshabilitacion de usuarios del sistema' });
    const p4 = permisoRepo.create({ id: 4, nombre: 'ver_auditoria', descripcion: 'Acceso a registros historicos y trazabilidad de eventos' });
    await permisoRepo.save([p1, p2, p3, p4]);

    // 4. Especialidades
    console.log('[Seeder] Sembrando Especialidades...');
    const esp1 = especialidadRepo.create({ id: 1, nombre: 'Geriatría', descripcion: 'Atención integral del adulto mayor en PADOMI' });
    const esp2 = especialidadRepo.create({ id: 2, nombre: 'Cardiología', descripcion: 'Enfermedades cardiovasculares y circulatorias' });
    const esp3 = especialidadRepo.create({ id: 3, nombre: 'Sistemas', descripcion: 'Soporte e ingeniería de sistemas' });
    await especialidadRepo.save([esp1, esp2, esp3]);

    // 5. Usuarios
    console.log('[Seeder] Sembrando Usuarios...');
    // Hashes precalculados de bcrypt para "admin_secreto" y "carlos_secreto"
    const adminUser = usuarioRepo.create({
      id: 'D0A4D592-EE4F-4C23-9D27-7B1A53E4A28A',
      codigo: 'USU-0001',
      dni: '72839401',
      nombre: 'Administrador',
      apellido: 'PADOMI',
      email: 'admin.padomi@essalud.gob.pe',
      passwordHash: '$2b$10$onkZF7md1LF6rfhFykm0zu.4BMfqmzXj5o6Bm8Uu89vjXlVf81qBq',
      rolId: 1,
      activo: true,
      especialidadId: 3
    });

    const medicoUser = usuarioRepo.create({
      id: '99999999-9999-9999-9999-999999999999',
      codigo: 'USU-0002',
      dni: '45812048',
      nombre: 'Carlos',
      apellido: 'Mendoza Ramos',
      email: 'carlos.mendoza@essalud.gob.pe',
      passwordHash: '$2b$10$oZrf7pB/nyL9B/Ku3AgCnuuXADRM21y9cUd6XyXM8KapEXm3DzOd2',
      rolId: 2,
      activo: true,
      especialidadId: 1
    });
    await usuarioRepo.save([adminUser, medicoUser]);

    // 6. Pacientes
    console.log('[Seeder] Sembrando Pacientes...');
    const pac1 = pacienteRepo.create({
      id: 'E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74',
      codigo: 'PAC-0001',
      dni: '72223340',
      nombres: 'Lucía Alva',
      edad: 65,
      diagnostico: 'Insuficiencia Cardiaca',
      medicoAsignadoId: '99999999-9999-9999-9999-999999999999',
      telefono: '991234567',
      direccion: 'Av. Salaverry 1420, Jesús María, Lima'
    });

    const pac2 = pacienteRepo.create({
      id: 'C5DA04A4-8B85-4C3D-8822-1BD048BB8561',
      codigo: 'PAC-0002',
      dni: '50112014',
      nombres: 'Julio Cortazar',
      edad: 72,
      diagnostico: 'Insuficiencia Respiratoria Crónica',
      medicoAsignadoId: '99999999-9999-9999-9999-999999999999',
      telefono: '987654321',
      direccion: 'Jr. Huascar 1520, Jesús María, Lima'
    });

    const pac3 = pacienteRepo.create({
      id: 'DF25697B-3620-4CFC-BDD2-1BD0484BB851',
      codigo: 'PAC-0003',
      dni: '71112223',
      nombres: 'Pedro Mendoza',
      edad: 74,
      diagnostico: 'Hipertensión severa',
      medicoAsignadoId: '99999999-9999-9999-9999-999999999999',
      telefono: '998877665',
      direccion: 'Calle Las Flores 450, Lince, Lima'
    });
    await pacienteRepo.save([pac1, pac2, pac3]);

    // 7. Métricas Clínicas
    console.log('[Seeder] Sembrando Métricas...');
    const m1 = metricaRepo.create({ id: '90000000-0000-0000-0000-000000000001', codigo: 'MET-0001', nombre: 'Glucosa', unidad: 'mg/dL', descripcion: 'Nivel de azucar en sangre', rangoMin: 70, rangoMax: 140 });
    const m2 = metricaRepo.create({ id: '90000000-0000-0000-0000-000000000002', codigo: 'MET-0002', nombre: 'Presion Arterial', unidad: 'mmHg', descripcion: 'Presion sistolica arterial', rangoMin: 90, rangoMax: 130 });
    const m3 = metricaRepo.create({ id: '90000000-0000-0000-0000-000000000005', codigo: 'MET-0005', nombre: 'Frecuencia Cardiaca', unidad: 'lpm', descripcion: 'Latidos por minuto', rangoMin: 60, rangoMax: 100 });
    const m4 = metricaRepo.create({ id: '90000000-0000-0000-0000-000000000006', codigo: 'MET-0006', nombre: 'Saturacion Oxigeno', unidad: '%', descripcion: 'Porcentaje de oxigeno en sangre (SpO2)', rangoMin: 95, rangoMax: 100 });
    await metricaRepo.save([m1, m2, m3, m4]);

    // 8. Enfermedades Crónicas
    console.log('[Seeder] Sembrando Enfermedades Crónicas...');
    const enf1 = enfermedadRepo.create({ id: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', codigo: 'ENF-0001', nombre: 'Diabetes Mellitus Tipo 2', descripcion: 'Defecto en secrecion y accion de insulina' });
    const enf2 = enfermedadRepo.create({ id: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', codigo: 'ENF-0002', nombre: 'Hipertensión Arterial Sistémica', descripcion: 'Incremento continuo de la presion sanguinea' });
    const enf3 = enfermedadRepo.create({ id: 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3', codigo: 'ENF-0003', nombre: 'EPOC', descripcion: 'Enfermedad Pulmonar Obstructiva Cronica' });
    await enfermedadRepo.save([enf1, enf2, enf3]);

    // 9. Relaciones Paciente - Enfermedad
    console.log('[Seeder] Sembrando Relaciones Paciente-Enfermedad...');
    const pe1 = pacienteEnfermedadRepo.create({ pacienteId: pac1.id, enfermedadId: enf2.id });
    const pe2 = pacienteEnfermedadRepo.create({ pacienteId: pac2.id, enfermedadId: enf3.id });
    const pe3 = pacienteEnfermedadRepo.create({ pacienteId: pac3.id, enfermedadId: enf2.id });
    await pacienteEnfermedadRepo.save([pe1, pe2, pe3]);

    // 10. Umbrales Clínicos Personalizados
    console.log('[Seeder] Sembrando Umbrales Clínicos Personalizados...');
    const u1 = umbralRepo.create({ id: 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', codigo: 'UMB-0001', pacienteId: pac1.id, metricaId: m3.id, valorMin: 60, valorMax: 95 });
    const u2 = umbralRepo.create({ id: 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', codigo: 'UMB-0002', pacienteId: pac1.id, metricaId: m2.id, valorMin: 95, valorMax: 125 });
    const u3 = umbralRepo.create({ id: 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', codigo: 'UMB-0003', pacienteId: pac2.id, metricaId: m3.id, valorMin: 65, valorMax: 90 });
    const u4 = umbralRepo.create({ id: 'f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4', codigo: 'UMB-0004', pacienteId: pac2.id, metricaId: m4.id, valorMin: 95, valorMax: 98 });
    const u5 = umbralRepo.create({ id: 'f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', codigo: 'UMB-0005', pacienteId: pac3.id, metricaId: m2.id, valorMin: 90, valorMax: 130 });
    const u6 = umbralRepo.create({ id: 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', codigo: 'UMB-0006', pacienteId: pac3.id, metricaId: m1.id, valorMin: 80, valorMax: 120 });
    await umbralRepo.save([u1, u2, u3, u4, u5, u6]);

    console.log('[Seeder] Siembra de datos iniciales completada exitosamente.');
  }
}
