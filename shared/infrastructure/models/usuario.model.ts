// Modelo ORM compartido utilizado en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal).
// Define la estructura física de la tabla de usuarios en Azure SQL usando TypeORM.
// Se reutiliza en todos los casos de uso que requieran persistencia de usuarios.

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Usuario' })
@Unique(['email'])
export class UsuarioModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'nvarchar', length: 20, nullable: true, unique: true })
  codigo!: string | null; // Ejemplo: USU-0001 (opcional)

  @Column({ type: 'char', length: 8, unique: true })
  dni!: string;

  @Column({ type: 'nvarchar', length: 100 })
  nombre!: string;

  @Column({ type: 'nvarchar', length: 100 })
  apellido!: string;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'nvarchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'nvarchar', length: 30 })
  rol!: string; // 'MEDICO', 'ENFERMERO', 'ADMINISTRATIVO'

  @Column({ type: 'bit' })
  activo!: boolean;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  especialidad!: string | null;
}
