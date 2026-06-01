import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Configurar para cargar las variables del archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Modelos (Entidades de persistencia ORM)
import { UsuarioModel } from './models/usuario.model';
import { PacienteModel } from './models/paciente.model';
import { MetricaModel } from './models/metrica.model';
import { EnfermedadCronicaModel } from './models/enfermedad-cronica.model';
import { PacienteEnfermedadModel } from './models/paciente-enfermedad.model';
import { UmbralModel } from './models/umbral.model';
import { LecturaModel } from './models/lectura.model';
import { AlertaModel } from './models/alerta.model';
import { EvaluacionModel } from './models/evaluacion.model';

/**
 * Clase DatabaseConnection
 * Implementa el Patrón de Diseño Creacional: SINGLETON.
 * Garantiza que la aplicación tenga una única instancia de conexión (DataSource)
 * hacia la base de datos Azure SQL Server, administrando un pool de conexiones único,
 * previniendo el consumo excesivo de sockets y previniendo errores de límite en la nube.
 */
export class DatabaseConnection {
  // Atributo estático que almacenará la instancia única de la clase
  private static instance: DatabaseConnection;

  // Atributo que mantiene el DataSource real de TypeORM
  private dataSource: DataSource;

  /**
   * Constructor Privado:
   * Evita la creación de instancias con la palabra clave `new` desde el exterior.
   */
  private constructor() {
    this.dataSource = new DataSource({
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
  }

  /**
   * Método Estático Global de Acceso:
   * Retorna la instancia única de DatabaseConnection. Si no existe, la crea.
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Retorna el DataSource configurado para ser utilizado por los repositorios.
   */
  public getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Inicializa la conexión física a la base de datos si no ha sido establecida aún.
   */
  public async initialize(): Promise<DataSource> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
    return this.dataSource;
  }
}

/**
 * EXPORTACIÓN COMPATIBLE (AppDataSource):
 * Permite que los repositorios y la inicialización en server.ts sigan funcionando
 * de forma directa sin romper código heredado, utilizando internamente la
 * instancia única gobernada por el Singleton.
 */
export const AppDataSource = DatabaseConnection.getInstance().getDataSource();
