// Modelo ORM compartido para la entidad Alerta
// Utilizado en CU-06 (Monitorear Dashboard Clínico) y CU-07 (Atender Emergencia Médica)
// Define la estructura física de la tabla de alertas en Azure SQL usando TypeORM.

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Alerta' })
@Unique(['codigo'])
export class AlertaModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'nvarchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: ALT-0001

  @Column({ type: 'uuid' })
  pacienteId!: string; // FOREIGN KEY a Paciente(id)

  @Column({ type: 'uuid' })
  lecturaId!: string; // FOREIGN KEY a Lectura(id)

  @Column({ type: 'nvarchar', length: 20 })
  severidad!: string; // 'NORMAL', 'ADVERTENCIA', 'CRITICO'

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  mensaje!: string;

  @Column({ type: 'datetime2' })
  fecha!: Date;

  @Column({ type: 'bit' })
  atendida!: boolean;
}
