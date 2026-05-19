# Sistema de Telemetría PADOMI (Backend)

Bienvenido al repositorio del backend del Sistema de Telemetría PADOMI. Este proyecto implementa una Arquitectura Limpia (Clean Architecture) orientada a eventos para el monitoreo de pacientes crónicos en tiempo real.

---

## AVISO IMPORTANTE: Uso Exclusivo de PNPM

Para este proyecto **NO ESTÁ PERMITIDO EL USO DE `npm` O `yarn`**. 
Hemos migrado toda la arquitectura a **`pnpm`** por las siguientes razones críticas:
1. **Seguridad:** Se detectaron vulnerabilidades de dependencias fantasma asociadas a versiones antiguas de npm.
2. **Monorepositorio (Workspaces):** La estructura del proyecto separa el código en `apps/backend` y `shared/`. Solo `pnpm` maneja estos enlaces simbólicos de manera eficiente y nativa usando el archivo `pnpm-workspace.yaml`.
3. **Velocidad y Espacio:** pnpm crea un almacén global en tu disco duro, reduciendo los tiempos de instalación al mínimo.

Si intentas instalar paquetes usando `npm install`, romperás los enlaces de los workspaces y la arquitectura compartida dejará de funcionar.

---

## Requisitos Previos (Para Compañeros de Equipo)

Antes de empezar a trabajar en tu computadora, asegúrate de tener:
- **Node.js** (Versión 20 o superior recomendada).
- **pnpm** instalado globalmente. Si no lo tienes, abre tu terminal y ejecuta:
  ```bash
  npm install -g pnpm
  ```

---

## Pasos para Levantar el Proyecto Localmente

Sigue estos pasos en orden estricto la primera vez que descargues (clones) el repositorio en tu PC:

### 1. Clonar e Instalar Dependencias
Abre la terminal en la raíz del proyecto (donde está este archivo README) y ejecuta:
```bash
# Esto instalará automáticamente las dependencias del backend y de la carpeta compartida a la vez.
pnpm install
```

### 2. Configurar Variables de Entorno
En la raíz del proyecto (la misma carpeta donde está este README), debes crear un archivo llamado **exactamente** `.env`. 

Ese archivo debe contener las credenciales de conexión a Azure SQL. *(Pídele las credenciales al administrador del equipo, ya que por seguridad no se suben a GitHub)*. Debe tener esta estructura:

```env
DB_HOST=padomi-sql-server.database.windows.net
DB_PORT=1433
DB_USER=tucorreo@...
DB_PASSWORD=tu_password
DB_NAME=free-sql-db-7168518
```

> **Nota:** Es indispensable que tu dirección IP actual de internet esté autorizada en el Firewall del Portal de Microsoft Azure. De lo contrario, el backend te arrojará un error de "Timeout" al intentar conectarse.

### 3. Levantar el Servidor
Una vez configurado el `.env` y las dependencias, navega a la carpeta del backend y arranca el servidor:

```bash
cd apps/backend
pnpm run dev
```

Si todo está correcto, la terminal mostrará:
```text
Conectando a la base de datos...
Conexión a la base de datos exitosa.
Inicializando WebSockets para el Dashboard...
=========================================
Servidor Telemetría PADOMI en ejecución:
URL HTTP: http://localhost:3000
```

¡Y listo! Ya puedes empezar a probar las rutas y seguir programando.
