import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recurso' })
export class RecursoModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  ruta!: string;
}
