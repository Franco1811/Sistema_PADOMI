// Modelo ORM compartido utilizado en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal).
// Define la estructura física de la tabla de usuarios en Azure SQL usando TypeORM.
// Se reutiliza en todos los casos de uso que requieran persistencia de usuarios.

import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { RolModel } from './rol.model';
import { EspecialidadModel } from './especialidad.model';

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

  @Column({ type: 'int' })
  rolId!: number;

  @ManyToOne(() => RolModel)
  @JoinColumn({ name: 'rolId' })
  rol!: RolModel;

  @Column({ type: 'bit' })
  activo!: boolean;

  @Column({ type: 'int', nullable: true })
  especialidadId!: number | null;

  @ManyToOne(() => EspecialidadModel, { nullable: true })
  @JoinColumn({ name: 'especialidadId' })
  especialidadRelation!: EspecialidadModel | null;
}
