import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { UsuarioModel } from './models/usuario.model';
import { PacienteModel } from './models/paciente.model';
import { MetricaModel } from './models/metrica.model';
import { EnfermedadCronicaModel } from './models/enfermedad-cronica.model';
import { PacienteEnfermedadModel } from './models/paciente-enfermedad.model';
import { UmbralModel } from './models/umbral.model';
import { LecturaModel } from './models/lectura.model';
import { AlertaModel } from './models/alerta.model';
import { EvaluacionModel } from './models/evaluacion.model';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  options: { encrypt: true },
  entities: [
    UsuarioModel,
    PacienteModel,
    MetricaModel,
    EnfermedadCronicaModel,
    PacienteEnfermedadModel,
    UmbralModel,
    LecturaModel,
    AlertaModel,
    EvaluacionModel,
  ],
});
