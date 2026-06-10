-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - PADOMI TELEMETRÍA (POSTGRESQL)
-- ============================================================================

-- 1. ELIMINAR TABLAS EXISTENTES (Orden correcto por integridad referencial)
-- ============================================================================
DROP TABLE IF EXISTS Evaluacion CASCADE;
DROP TABLE IF EXISTS Alerta CASCADE;
DROP TABLE IF EXISTS Lectura CASCADE;
DROP TABLE IF EXISTS Umbral CASCADE;
DROP TABLE IF EXISTS PacienteEnfermedad CASCADE;
DROP TABLE IF EXISTS EnfermedadCronica CASCADE;
DROP TABLE IF EXISTS Paciente CASCADE;
DROP TABLE IF EXISTS Metrica CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Especialidad CASCADE;
DROP TABLE IF EXISTS rol_recurso CASCADE;
DROP TABLE IF EXISTS recurso CASCADE;
DROP TABLE IF EXISTS rol_permiso CASCADE;
DROP TABLE IF EXISTS permiso CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

-- 2. CREACIÓN DE TABLAS DE CONTROL DE ACCESOS (RBAC)
-- ============================================================================

-- Tabla de Roles
CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Permisos
CREATE TABLE permiso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL
);

-- Tabla Intermedia Rol-Permiso (Muchos a Muchos)
CREATE TABLE rol_permiso (
    rol_id INT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
    permiso_id INT NOT NULL REFERENCES permiso(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- Tabla de Recursos (Vistas / Rutas del Dashboard)
CREATE TABLE recurso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    ruta VARCHAR(100) NOT NULL
);

-- Tabla Intermedia Rol-Recurso (Muchos a Muchos)
CREATE TABLE rol_recurso (
    rol_id INT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
    recurso_id INT NOT NULL REFERENCES recurso(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, recurso_id)
);

-- 3. CREACIÓN DE ENTIDADES CLÍNICAS Y DE USUARIOS
-- ============================================================================

-- Tabla de Especialidades Médicas
CREATE TABLE Especialidad (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL
);

-- Tabla de Usuarios (Con llave foránea al Rol y Especialidad)
CREATE TABLE Usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NULL UNIQUE, -- Ejemplo: USU-0001
    dni CHAR(8) NOT NULL UNIQUE,    
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    rolId INT NOT NULL REFERENCES rol(id),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    especialidadId INT NULL REFERENCES Especialidad(id)
);

-- Tabla de Pacientes
CREATE TABLE Paciente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: PAC-0001
    dni CHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    diagnostico VARCHAR(255) NULL,
    medicoAsignadoId UUID NOT NULL REFERENCES Usuario(id),
    telefono VARCHAR(20) NULL,           -- Teléfono de contacto clínico (CU-07)
    direccion VARCHAR(255) NULL          -- Dirección de despacho (CU-07)
);

-- Tabla de Métricas Biométricas
CREATE TABLE Metrica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: MET-0001
    nombre VARCHAR(100) NOT NULL UNIQUE,
    unidad VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255) NULL,
    rangoMin DOUBLE PRECISION NOT NULL,
    rangoMax DOUBLE PRECISION NOT NULL
);
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: ENF-0001
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL
);

-- Relación Paciente-Enfermedad (Muchos a Muchos)
CREATE TABLE PacienteEnfermedad (
    pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
    enfermedadId UUID NOT NULL REFERENCES EnfermedadCronica(id) ON DELETE CASCADE,
    PRIMARY KEY (pacienteId, enfermedadId)
);

-- Tabla de Umbrales Clínicos Personalizados
CREATE TABLE Umbral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NULL UNIQUE, -- Ejemplo: UMB-0001
    pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
    metricaId UUID NOT NULL REFERENCES Metrica(id) ON DELETE CASCADE,
    valorMin DOUBLE PRECISION NOT NULL,
    valorMax DOUBLE PRECISION NOT NULL,
    CONSTRAINT UQ_Umbral_Paciente_Metrica UNIQUE (pacienteId, metricaId)
);

-- Tabla de Lecturas de Telemetría
CREATE TABLE Lectura (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: LEC-0001
    pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
    metricaId UUID NOT NULL REFERENCES Metrica(id) ON DELETE CASCADE,
    valor DOUBLE PRECISION NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Alertas Clínicas
CREATE TABLE Alerta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: ALT-0001
    pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
    lecturaId UUID NOT NULL REFERENCES Lectura(id) ON DELETE CASCADE,
    severidad VARCHAR(20) NOT NULL, -- 'NORMAL', 'ADVERTENCIA', 'CRITICO'
    mensaje VARCHAR(255) NULL,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    atendida BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla de Evaluaciones Médico-Legales
CREATE TABLE Evaluacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) NOT NULL UNIQUE, -- Ejemplo: EVA-0001
    pacienteId UUID NOT NULL REFERENCES Paciente(id) ON DELETE CASCADE,
    medicoId UUID NOT NULL REFERENCES Usuario(id) ON DELETE CASCADE,
    alertaId UUID NULL REFERENCES Alerta(id) ON DELETE SET NULL,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    resumen VARCHAR(500) NULL,
    recomendaciones VARCHAR(500) NULL
);

-- ============================================================================
-- 4. SIEMBRA DE DATOS INICIALES (SEEDERS)
-- ============================================================================

-- Sembrado de Roles
INSERT INTO rol (nombre) VALUES ('ADMIN'), ('MEDICO');

-- Sembrado de Permisos
INSERT INTO permiso (nombre, descripcion) VALUES 
('atender_alerta', 'Permite atender y emitir evaluaciones de alertas criticas'),
('monitorear_pacientes', 'Permite la lectura del dashboard clínico interactivo en tiempo real'),
('gestionar_usuarios', 'Permite la creacion, edicion y deshabilitacion de usuarios del sistema'),
('ver_auditoria', 'Acceso a registros historicos y trazabilidad de eventos');

-- Asociación de Permisos a Roles
-- ADMIN tiene todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4);
-- MEDICO solo atiende alertas y monitorea
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES 
(2, 1), (2, 2);

-- Sembrado de Recursos (Vistas / Pantallas del Frontend)
INSERT INTO recurso (nombre, ruta) VALUES 
('Dashboard Clinico', '/dashboard'),
('Gestion Usuarios', '/usuarios'),
('Reportes y Metricas', '/reportes');

-- Asociación de Recursos a Roles
-- ADMIN entra a usuarios y reportes
INSERT INTO rol_recurso (rol_id, recurso_id) VALUES 
(1, 2), (1, 3);
-- MEDICO entra a dashboard y reportes
INSERT INTO rol_recurso (rol_id, recurso_id) VALUES 
(2, 1), (2, 3);

-- Sembrado de Especialidades Médicas
INSERT INTO Especialidad (nombre, descripcion) VALUES 
('Geriatría', 'Atención integral del adulto mayor en PADOMI'),
('Cardiología', 'Enfermedades cardiovasculares y circulatorias'),
('Sistemas', 'Soporte e ingeniería de sistemas');

-- Sembrado de Usuarios (Contraseñas con hash bcrypt)
-- Password real para ambos: "admin_secreto" y "carlos_secreto" respectivamente
INSERT INTO Usuario (id, codigo, dni, nombre, apellido, email, passwordHash, rolId, activo, especialidadId)
VALUES 
('D0A4D592-EE4F-4C23-9D27-7B1A53E4A28A', 'USU-0001', '72839401', 'Administrador', 'PADOMI', 'admin.padomi@essalud.gob.pe', '$2b$10$onkZF7md1LF6rfhFykm0zu.4BMfqmzXj5o6Bm8Uu89vjXlVf81qBq', 1, TRUE, 3),
('99999999-9999-9999-9999-999999999999', 'USU-0002', '45812048', 'Carlos', 'Mendoza Ramos', 'carlos.mendoza@essalud.gob.pe', '$2b$10$oZrf7pB/nyL9B/Ku3AgCnuuXADRM21y9cUd6XyXM8KapEXm3DzOd2', 2, TRUE, 1);

-- Sembrado de Pacientes
INSERT INTO Paciente (id, codigo, dni, nombres, edad, diagnostico, medicoAsignadoId, telefono, direccion)
VALUES 
('E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', 'PAC-0001', '72223340', 'Lucía Alva', 65, 'Insuficiencia Cardiaca', '99999999-9999-9999-9999-999999999999', '991234567', 'Av. Salaverry 1420, Jesús María, Lima'),
('C5DA04A4-8B85-4C3D-8822-1BD048BB8561', 'PAC-0002', '50112014', 'Julio Cortazar', 72, 'Insuficiencia Respiratoria Crónica', '99999999-9999-9999-9999-999999999999', '987654321', 'Jr. Huascar 1520, Jesús María, Lima'),
('DF25697B-3620-4CFC-BDD2-1BD0484BB851', 'PAC-0003', '71112223', 'Pedro Mendoza', 74, 'Hipertensión severa', '99999999-9999-9999-9999-999999999999', '998877665', 'Calle Las Flores 450, Lince, Lima');

-- Sembrado de Métricas Biométricas
INSERT INTO Metrica (id, codigo, nombre, unidad, descripcion, rangoMin, rangoMax)
VALUES 
('90000000-0000-0000-0000-000000000001', 'MET-0001', 'Glucosa', 'mg/dL', 'Nivel de azucar en sangre', 70, 140),
('90000000-0000-0000-0000-000000000002', 'MET-0002', 'Presion Arterial', 'mmHg', 'Presion sistolica arterial', 90, 130),
('90000000-0000-0000-0000-000000000005', 'MET-0005', 'Frecuencia Cardiaca', 'lpm', 'Latidos por minuto', 60, 100),
('90000000-0000-0000-0000-000000000006', 'MET-0006', 'Saturacion Oxigeno', '%', 'Porcentaje de oxigeno en sangre (SpO2)', 95, 100);

-- Sembrado de Enfermedades Crónicas
INSERT INTO EnfermedadCronica (id, codigo, nombre, descripcion)
VALUES 
('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'ENF-0001', 'Diabetes Mellitus Tipo 2', 'Defecto en secrecion y accion de insulina'),
('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'ENF-0002', 'Hipertensión Arterial Sistémica', 'Incremento continuo de la presion sanguinea'),
('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3', 'ENF-0003', 'EPOC', 'Enfermedad Pulmonar Obstructiva Cronica');

-- Relación Paciente-Enfermedad
INSERT INTO PacienteEnfermedad (pacienteId, enfermedadId)
VALUES 
('E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2'),
('C5DA04A4-8B85-4C3D-8822-1BD048BB8561', 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3'),
('DF25697B-3620-4CFC-BDD2-1BD0484BB851', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2');

-- Sembrado de Umbrales Clínicos Personalizados
INSERT INTO Umbral (id, codigo, pacienteId, metricaId, valorMin, valorMax)
VALUES 
('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'UMB-0001', 'E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', '90000000-0000-0000-0000-000000000005', 60, 95),
('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'UMB-0002', 'E6C5C0A0-4F74-428D-9E9C-3E8C3D0A4F74', '90000000-0000-0000-0000-000000000002', 95, 125),
('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'UMB-0003', 'C5DA04A4-8B85-4C3D-8822-1BD048BB8561', '90000000-0000-0000-0000-000000000005', 65, 90),
('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4', 'UMB-0004', 'C5DA04A4-8B85-4C3D-8822-1BD048BB8561', '90000000-0000-0000-0000-000000000006', 95, 98),
('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', 'UMB-0005', 'DF25697B-3620-4CFC-BDD2-1BD0484BB851', '90000000-0000-0000-0000-000000000002', 90, 130),
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'UMB-0006', 'DF25697B-3620-4CFC-BDD2-1BD0484BB851', '90000000-0000-0000-0000-000000000001', 80, 120);
