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
├── shared/             # Kernel compartido (Entidades, Interfaces y Modelos de Azure SQL)
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

Antes de empezar a trabajar en tu computadora, asegúrate de tener:
- **Node.js** (Versión 20 o superior recomendada).
- **pnpm** instalado globalmente. Si no lo tienes, abre tu consola y ejecuta:
  ```bash
  npm install -g pnpm
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
Debe tener la siguiente estructura con las credenciales de tu base de datos Azure SQL Server:

```env
DB_HOST=padomi-sql-server.database.windows.net
DB_PORT=1433
DB_USERNAME=adminpadomi
DB_PASSWORD=tu_password
DB_NAME=free-sql-db-7168518
```

> **Nota:** Tu dirección IP pública de internet debe estar autorizada en el Firewall del Portal de Microsoft Azure para conectarse con la base de datos física de producción.

### 3. Levantar todo el Monorrepositorio en un Solo Paso
Para iniciar en simultáneo todos los entornos de desarrollo (Backend API, React Frontend y Azure Functions), ejecuta en la raíz del proyecto:

```bash
pnpm dev
```

Este comando levantará concurrentemente:
*   **Backend API:** `http://localhost:3000`
*   **Frontend React:** `http://localhost:5173`
*   **Azure Function:** `http://localhost:7071/api/HttpTrigger` (Ingesta IoT)

---

## 🔌 Pruebas de Integración y Flujo de Datos

El flujo obligatorio para las lecturas del IoT es:
`Sensor IoT` $\rightarrow$ `Azure Function (Puerto 7071)` $\rightarrow$ `Backend (Puerto 3000)` $\rightarrow$ `Dashboard Web (WebSockets)`

Puedes simular el envío de constantes vitales directamente desde el archivo de VS Code **[pruebas_api.http](file:///c:/Desarrollo/ProyectosUPN/sistema-telemetria-padomi/pruebas_api.http#L551-L562)** utilizando la prueba **8.4**.

---

## 🔧 Solución de Problemas Frecuentes en Windows

### Error: `listen EADDRINUSE: address already in use :::3000`
**Por qué ocurre:** Se quedó colgado un proceso de Node.js en segundo plano de ejecuciones anteriores reteniendo los puertos.
**Solución:** Ejecuta el siguiente comando en tu consola de Windows (CMD o PowerShell) para liberar todos los puertos locales ocupados:
```bash
taskkill /f /im node.exe
```
