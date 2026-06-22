# Sistema de Telemetría PADOMI (Monorrepositorio)

Bienvenido al repositorio del Sistema de Telemetría PADOMI. Este proyecto integra en un monorrepositorio modular el flujo completo de telemetría IoT en tiempo real: Ingesta Serverless, Backend con Arquitectura Limpia (Clean Architecture) orientada a eventos, y un Dashboard Clínico interactivo.

---

## 📂 Estructura del Proyecto

La arquitectura está estructurada en módulos para separar responsabilidades y facilitar el mantenimiento del software:

```text
├── apps/
│   ├── backend/        # Servidor Express API y Servidor de WebSockets (Dashboard)
│   └── frontend/       # Dashboard Clínico Interactivo en React y Vite
├── functions/
│   └── Ingesta_Biometrica/  # Azure Function local (Puerto 7071) para ingesta IoT
├── shared/             # Kernel compartido (Entidades, Interfaces y Modelos de Postgres)
├── database/           # Scripts SQL (Traducción compatible con PostgreSQL para Supabase)
├── pnpm-workspace.yaml # Configuración del Monorrepositorio
└── package.json        # Orquestador global de scripts del proyecto
```

---

## ⚠️ AVISO IMPORTANTE: Uso Exclusivo de PNPM

Para este proyecto **NO ESTÁ PERMITIDO EL USO DE `npm` O `yarn`**. 
Hemos migrado toda la arquitectura a **`pnpm`** por las siguientes razones críticas:
1. **Seguridad e Integridad:** pnpm evita dependencias fantasmas de paquetes Node.
2. **Monorrepositorio (Workspaces):** La separación en `apps/`, `functions/` y `shared/` depende de los enlaces simbólicos de `pnpm-workspace.yaml`.
3. **Velocidad:** `pnpm` utiliza un almacén global (`pnpm store`) que evita duplicar archivos físicos de dependencias en disco.

*Si intentas instalar paquetes usando `npm install`, romperás los enlaces de los workspaces y los módulos dejarán de compilar.*

---

## 🛠️ Requisitos Previos

Antes de empezar a levantar el proyecto en tu máquina local, asegúrate de tener:
- **Node.js** (Versión 20 o superior recomendada).
- **pnpm** instalado globalmente. Si no lo tienes, ejecuta:
  ```bash
  npm install -g pnpm
  ```
- **Azurite** (Emulador de Azure Storage) instalado globalmente. Es obligatorio para que la Azure Function local pueda arrancar sin problemas de almacenamiento. Instálalo ejecutando:
  ```bash
  pnpm add -g azurite
  ```

---

## 🚀 Pasos para Levantar todo el Proyecto Localmente

Sigue estos pasos en orden estricto para configurar tu espacio de trabajo local:

### 1. Instalar Dependencias
Abre tu terminal en la raíz del proyecto (donde está este archivo README) e instala todo con un único comando:
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
Crea un archivo llamado exactamente `.env` en la raíz del proyecto (la misma carpeta donde está este README). 
Debe tener la siguiente estructura con las credenciales de la base de datos PostgreSQL de Supabase:

```env
DB_HOST=db.vgcvjnpfuvhkfxkrpdqt.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
# Asegúrate de incluir las comillas dobles literales en la contraseña para que dotenv la parsee correctamente
DB_PASSWORD='"tu_contraseña_de_supabase"'
DB_NAME=postgres
USE_IN_MEMORY=false
```

### 3. Ejecutar el Emulador de Almacenamiento (Azurite)
Abre una **nueva terminal** y ejecuta el emulador Azurite para levantar el almacenamiento local que requiere la Azure Function:
```bash
azurite
```
*Déjala corriendo en esa ventana; verás que empieza a escribir logs indicando que está escuchando peticiones.*

### 4. Iniciar la Aplicación
Abre otra terminal en la raíz del proyecto y arranca todos los entornos en paralelo (Backend API, React Frontend y Azure Functions):
```bash
pnpm dev
```

Este comando levantará concurrentemente:
*   **Backend API:** `http://localhost:3000` (con conexión a Supabase y carga automática de datos iniciales de prueba)
*   **Frontend React:** `http://localhost:5173` (Dashboard Clínico)
*   **Azure Function:** `http://localhost:7071/api/HttpTrigger` (Ingesta IoT de telemetría)

---

## 🔌 Pruebas de Integración y Flujo de Datos

El flujo obligatorio para las lecturas del IoT es:
`Sensor IoT` $\rightarrow$ `Azure Function (Puerto 7071)` $\rightarrow$ `Backend (Puerto 3000)` $\rightarrow$ `Dashboard Web (WebSockets)`

Puedes simular el envío de constantes vitales en tiempo real directamente desde el archivo de VS Code **[pruebas_api.http](file:///c:/Desarrollo/ProyectosUPN/sistema-telemetria-padomi/pruebas_api.http#L551-L562)** utilizando la petición **8.4 ("Simular Lectura Crítica - Ritmo Cardíaco Alto")**.

---

## 🔧 Solución de Problemas Frecuentes en Windows

### Error: `listen EADDRINUSE: address already in use :::3000`
**Por qué ocurre:** Se quedó colgado un proceso de Node.js en segundo plano de ejecuciones anteriores reteniendo los puertos.
**Solución:** Ejecuta el siguiente comando en tu consola de Windows (PowerShell) para liberar todos los puertos ocupados por Node:
```powershell
taskkill /f /im node.exe
```
