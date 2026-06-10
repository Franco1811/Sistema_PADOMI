-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - PADOMI TELEMETRÍA
-- ============================================================================

-- 1. ELIMINAR TABLAS EXISTENTES (Orden correcto por integridad referencial)
-- ============================================================================
IF OBJECT_ID('dbo.Evaluacion', 'U') IS NOT NULL DROP TABLE dbo.Evaluacion;
IF OBJECT_ID('dbo.Alerta', 'U') IS NOT NULL DROP TABLE dbo.Alerta;
IF OBJECT_ID('dbo.Lectura', 'U') IS NOT NULL DROP TABLE dbo.Lectura;
IF OBJECT_ID('dbo.Umbral', 'U') IS NOT NULL DROP TABLE dbo.Umbral;
IF OBJECT_ID('dbo.PacienteEnfermedad', 'U') IS NOT NULL DROP TABLE dbo.PacienteEnfermedad;
IF OBJECT_ID('dbo.EnfermedadCronica', 'U') IS NOT NULL DROP TABLE dbo.EnfermedadCronica;
IF OBJECT_ID('dbo.Paciente', 'U') IS NOT NULL DROP TABLE dbo.Paciente;
IF OBJECT_ID('dbo.Metrica', 'U') IS NOT NULL DROP TABLE dbo.Metrica;
IF OBJECT_ID('dbo.Usuario', 'U') IS NOT NULL DROP TABLE dbo.Usuario;
IF OBJECT_ID('dbo.Especialidad', 'U') IS NOT NULL DROP TABLE dbo.Especialidad;
IF OBJECT_ID('dbo.rol_recurso', 'U') IS NOT NULL DROP TABLE dbo.rol_recurso;
IF OBJECT_ID('dbo.recurso', 'U') IS NOT NULL DROP TABLE dbo.recurso;
IF OBJECT_ID('dbo.rol_permiso', 'U') IS NOT NULL DROP TABLE dbo.rol_permiso;
IF OBJECT_ID('dbo.permiso', 'U') IS NOT NULL DROP TABLE dbo.permiso;
IF OBJECT_ID('dbo.rol', 'U') IS NOT NULL DROP TABLE dbo.rol;
GO

-- 2. CREACIÓN DE TABLAS DE CONTROL DE ACCESOS (RBAC)
-- ============================================================================

-- Tabla de Roles
CREATE TABLE rol (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE
);
GO

-- Tabla de Permisos
CREATE TABLE permiso (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL
);
GO

-- Tabla Intermedia Rol-Permiso (Muchos a Muchos)
CREATE TABLE rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permiso(id) ON DELETE CASCADE
);
GO

-- Tabla de Recursos (Vistas / Rutas del Dashboard)
CREATE TABLE recurso (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    ruta VARCHAR(100) NOT NULL
);
GO

-- Tabla Intermedia Rol-Recurso (Muchos a Muchos)
CREATE TABLE rol_recurso (
    rol_id INT NOT NULL,
    recurso_id INT NOT NULL,
    PRIMARY KEY (rol_id, recurso_id),
    FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE CASCADE,
    FOREIGN KEY (recurso_id) REFERENCES recurso(id) ON DELETE CASCADE
);
GO

-- 3. CREACIÓN DE ENTIDADES CLÍNICAS Y DE USUARIOS
-- ============================================================================

-- Tabla de Especialidades Médicas
CREATE TABLE Especialidad (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL
);
GO
select * from Especialidad

-- Tabla de Usuarios (Con llave foránea al Rol y Especialidad)
CREATE TABLE Usuario (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NULL UNIQUE, -- Ejemplo: USU-0001
    dni CHAR(8) NOT NULL UNIQUE,    
    nombre NVARCHAR(100) NOT NULL,
    apellido NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    passwordHash NVARCHAR(255) NOT NULL,
    rolId INT NOT NULL, -- Clave foránea al catálogo de roles (ADMIN o MEDICO)
    activo BIT NOT NULL DEFAULT 1,
    especialidadId INT NULL, -- Clave foránea a Especialidad (opcional para médicos)
    FOREIGN KEY (rolId) REFERENCES rol(id),
    FOREIGN KEY (especialidadId) REFERENCES Especialidad(id)
);
GO
select * from Usuario


-- Tabla de Pacientes
CREATE TABLE Paciente (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: PAC-0001
    dni CHAR(8) NOT NULL UNIQUE,
    nombres NVARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    diagnostico NVARCHAR(255) NULL,
    medicoAsignadoId UNIQUEIDENTIFIER NOT NULL,
    telefono NVARCHAR(20) NULL,           -- Teléfono de contacto clínico (CU-07)
    direccion NVARCHAR(255) NULL,         -- Dirección de despacho (CU-07)
    FOREIGN KEY (medicoAsignadoId) REFERENCES Usuario(id)
);
GO
select * from paciente

-- Tabla de Métricas Biométricas
CREATE TABLE Metrica (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: MET-0001
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    unidad NVARCHAR(20) NOT NULL,
    descripcion NVARCHAR(255) NULL,
    rangoMin FLOAT NOT NULL,
    rangoMax FLOAT NOT NULL
);
GO
select * from Metrica
INSERT INTO Metrica (id, codigo, nombre, unidad, descripcion, rangoMin, rangoMax)
VALUES (
  NEWID(),
  'MET-0007',
  'Temperatura Corporal',
  '°C',
  'Temperatura corporal del paciente',
  36.0,
  37.5
);




-- Tabla de Enfermedades Crónicas
CREATE TABLE EnfermedadCronica (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: ENF-0001
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL
);
GO

-- Relación Paciente-Enfermedad (Muchos a Muchos)
CREATE TABLE PacienteEnfermedad (
    pacienteId UNIQUEIDENTIFIER NOT NULL,
    enfermedadId UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (pacienteId, enfermedadId),
    FOREIGN KEY (pacienteId) REFERENCES Paciente(id),
    FOREIGN KEY (enfermedadId) REFERENCES EnfermedadCronica(id)
);
GO

-- Tabla de Umbrales Clínicos Personalizados
CREATE TABLE Umbral (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NULL UNIQUE, -- Ejemplo: UMB-0001
    pacienteId UNIQUEIDENTIFIER NOT NULL,
    metricaId UNIQUEIDENTIFIER NOT NULL,
    valorMin FLOAT NOT NULL,
    valorMax FLOAT NOT NULL,
    FOREIGN KEY (pacienteId) REFERENCES Paciente(id),
    FOREIGN KEY (metricaId) REFERENCES Metrica(id),
    CONSTRAINT UQ_Umbral_Paciente_Metrica UNIQUE (pacienteId, metricaId)
);
GO

-- Tabla de Lecturas de Telemetría
CREATE TABLE Lectura (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: LEC-0001
    pacienteId UNIQUEIDENTIFIER NOT NULL,
    metricaId UNIQUEIDENTIFIER NOT NULL,
    valor FLOAT NOT NULL,
    fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    FOREIGN KEY (pacienteId) REFERENCES Paciente(id),
    FOREIGN KEY (metricaId) REFERENCES Metrica(id)
);
GO

-- Tabla de Alertas Clínicas
CREATE TABLE Alerta (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: ALT-0001
    pacienteId UNIQUEIDENTIFIER NOT NULL,
    lecturaId UNIQUEIDENTIFIER NOT NULL,
    severidad NVARCHAR(20) NOT NULL, -- 'NORMAL', 'ADVERTENCIA', 'CRITICO'
    mensaje NVARCHAR(255) NULL,
    fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    atendida BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (pacienteId) REFERENCES Paciente(id),
    FOREIGN KEY (lecturaId) REFERENCES Lectura(id)
);
GO

-- Tabla de Evaluaciones Médico-Legales
CREATE TABLE Evaluacion (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    codigo NVARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: EVA-0001
    pacienteId UNIQUEIDENTIFIER NOT NULL,
    medicoId UNIQUEIDENTIFIER NOT NULL,
    alertaId UNIQUEIDENTIFIER NULL,      -- Relación con alerta para trazabilidad de auditoría
    fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    resumen NVARCHAR(500) NULL,
    recomendaciones NVARCHAR(500) NULL,
    FOREIGN KEY (pacienteId) REFERENCES Paciente(id),
    FOREIGN KEY (medicoId) REFERENCES Usuario(id),
    FOREIGN KEY (alertaId) REFERENCES Alerta(id)
);
GO

-- ============================================================================
-- 4. SIEMBRA DE DATOS INICIALES (SEEDERS)
-- ============================================================================

-- Sembrado de Roles
INSERT INTO rol (nombre) VALUES ('ADMIN'), ('MEDICO');
GO

-- Sembrado de Permisos
INSERT INTO permiso (nombre, descripcion) VALUES 
('atender_alerta', 'Permite atender y emitir evaluaciones de alertas criticas'),
('monitorear_pacientes', 'Permite la lectura del dashboard clínico interactivo en tiempo real'),
('gestionar_usuarios', 'Permite la creacion, edicion y deshabilitacion de usuarios del sistema'),
('ver_auditoria', 'Acceso a registros historicos y trazabilidad de eventos');
GO

-- Asociación de Permisos a Roles
-- ADMIN tiene todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4);
-- MEDICO solo atiende alertas y monitorea
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES 
(2, 1), (2, 2);
GO

-- Sembrado de Recursos (Vistas / Pantallas del Frontend)
INSERT INTO recurso (nombre, ruta) VALUES 
('Dashboard Clinico', '/dashboard'),
('Gestion Usuarios', '/usuarios'),
('Reportes y Metricas', '/reportes');
GO

-- Asociación de Recursos a Roles
-- ADMIN entra a usuarios y reportes
INSERT INTO rol_recurso (rol_id, recurso_id) VALUES 
(1, 2), (1, 3);
-- MEDICO entra a dashboard y reportes
INSERT INTO rol_recurso (rol_id, recurso_id) VALUES 
(2, 1), (2, 3);
GO

-- Sembrado de Especialidades Médicas
INSERT INTO Especialidad (nombre, descripcion) VALUES 
('Geriatría', 'Atención integral del adulto mayor en PADOMI'),
('Cardiología', 'Enfermedades cardiovasculares y circulatorias'),
('Sistemas', 'Soporte e ingeniería de sistemas');
GO

-- Sembrado de Usuarios (Contraseñas con hash bcrypt)
-- Password real para ambos: "admin_secreto" y "carlos_secreto" respectivamente
INSERT INTO Usuario (id, codigo, dni, nombre, apellido, email, passwordHash, rolId, activo, especialidadId)
VALUES 
('D0A4D592-EE4F-4C23-9D27-7B1A53E4A28A', 'USU-0001', '72839401', 'Administrador', 'PADOMI', 'admin.padomi@essalud.gob.pe', '$2b$10$onkZF7md1LF6rfhFykm0zu.4BMfqmzXj5o6Bm8Uu89vjXlVf81qBq', 1, 1, 3),
('99999999-9999-9999-9999-999999999999', 'USU-0002', '45812048', 'Carlos', 'Mendoza Ramos', 'carlos.mendoza@essalud.gob.pe', '$2b$10$oZrf7pB/nyL9B/Ku3AgCnuuXADRM21y9cUd6XyXM8KapEXm3DzOd2', 2, 1, 1);
GO

-- Sembrado de Pacientes
INSERT INTO Paciente (id, codigo, dni, nombres, edad, diagnostico, medicoAsignadoId, telefono, direccion)
VALUES 
('E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', 'PAC-0001', '72223340', 'Lucía Alva', 65, 'Insuficiencia Cardiaca', '99999999-9999-9999-9999-999999999999', '991234567', 'Av. Salaverry 1420, Jesús María, Lima'),
('C5DA04A4-8B85-4C3D-8822-1BD048BB8561', 'PAC-0002', '50112014', 'Julio Cortazar', 72, 'Insuficiencia Respiratoria Crónica', '99999999-9999-9999-9999-999999999999', '987654321', 'Jr. Huascar 1520, Jesús María, Lima'),
('DF25697B-3620-4CFC-BDD2-1BD0484BB851', 'PAC-0003', '71112223', 'Pedro Mendoza', 74, 'Hipertensión severa', '99999999-9999-9999-9999-999999999999', '998877665', 'Calle Las Flores 450, Lince, Lima');
GO

-- Sembrado de Métricas Biométricas
INSERT INTO Metrica (id, codigo, nombre, unidad, descripcion, rangoMin, rangoMax)
VALUES 
(NEWID(), 'MET-0001', 'Glucosa', 'mg/dL', 'Nivel de azucar en sangre', 70, 140),
(NEWID(), 'MET-0002', 'Presion Arterial', 'mmHg', 'Presion sistolica arterial', 90, 130),
(NEWID(), 'MET-0005', 'Frecuencia Cardiaca', 'lpm', 'Latidos por minuto', 60, 100),
(NEWID(), 'MET-0006', 'Saturacion Oxigeno', '%', 'Porcentaje de oxigeno en sangre (SpO2)', 95, 100);
GO

-- Sembrado de Enfermedades Crónicas
INSERT INTO EnfermedadCronica (id, codigo, nombre, descripcion)
VALUES 
(NEWID(), 'ENF-0001', 'Diabetes Mellitus Tipo 2', 'Defecto en secrecion y accion de insulina'),
(NEWID(), 'ENF-0002', 'Hipertensión Arterial Sistémica', 'Incremento continuo de la presion sanguinea'),
(NEWID(), 'ENF-0003', 'EPOC', 'Enfermedad Pulmonar Obstructiva Cronica');
GO

-- Relación Paciente-Enfermedad
INSERT INTO PacienteEnfermedad (pacienteId, enfermedadId)
VALUES 
('E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', (SELECT id FROM EnfermedadCronica WHERE codigo = 'ENF-0002')),
('C5DA04A4-8B85-4C3D-8822-1BD048BB8561', (SELECT id FROM EnfermedadCronica WHERE codigo = 'ENF-0003')),
('DF25697B-3620-4CFC-BDD2-1BD0484BB851', (SELECT id FROM EnfermedadCronica WHERE codigo = 'ENF-0002'));
GO

-- Sembrado de Umbrales Clínicos Personalizados
INSERT INTO Umbral (id, codigo, pacienteId, metricaId, valorMin, valorMax)
VALUES 
(NEWID(), 'UMB-0001', 'E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', (SELECT id FROM Metrica WHERE codigo = 'MET-0005'), 60, 95),
(NEWID(), 'UMB-0002', 'E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', (SELECT id FROM Metrica WHERE codigo = 'MET-0002'), 95, 125),
(NEWID(), 'UMB-0003', 'C5DA04A4-8B85-4C3D-8822-1BD048BB8561', (SELECT id FROM Metrica WHERE codigo = 'MET-0005'), 65, 90),
(NEWID(), 'UMB-0004', 'C5DA04A4-8B85-4C3D-8822-1BD048BB8561', (SELECT id FROM Metrica WHERE codigo = 'MET-0006'), 95, 98),
(NEWID(), 'UMB-0005', 'DF25697B-3620-4CFC-BDD2-1BD0484BB851', (SELECT id FROM Metrica WHERE codigo = 'MET-0002'), 90, 130),
(NEWID(), 'UMB-0006', 'DF25697B-3620-4CFC-BDD2-1BD0484BB851', (SELECT id FROM Metrica WHERE codigo = 'MET-0001'), 80, 120);
GO

-- Verificación de inicialización completa
PRINT 'Base de datos PADOMI inicializada, estructurada y sembrada con éxito.';
