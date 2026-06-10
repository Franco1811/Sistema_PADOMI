import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'permiso' })
export class PermisoModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion!: string | null;
}
