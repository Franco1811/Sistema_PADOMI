# Resumen Técnico de Casos de Uso Implementados (CU-01 al CU-05)

Este documento detalla la lógica de negocio, las reglas clínicas, las medidas de seguridad y los mecanismos de integridad implementados en el backend del Sistema de Telemetría PADOMI para la sustentación.

---

## CU-01: Iniciar Sesión (Autenticación)
* **Objetivo:** Permitir el acceso seguro del personal de salud (Administrativos, Médicos y Enfermeros) y entregar el Token JWT para operaciones posteriores.

### ⚙️ Lógica e Integridad Implementada:
1. **Encriptación de Seguridad:** Comparación de contraseñas mediante hash con sal utilizando la librería **Bcrypt** (`bcrypt.compare`). Nunca se almacenan ni comparan contraseñas en texto plano.
2. **Validación de Cuenta Activa:** Si la cuenta del usuario existe pero fue inhabilitada lógicamente (`activo = false`), el sistema rechaza la autenticación de forma segura indicando que la cuenta está inactiva.
3. **Generación de JWT (JSON Web Token):** Retorna un token JWT firmado digitalmente usando `jsonwebtoken` con un tiempo de expiración seguro de **8 horas** (`expiresIn: '8h'`). El token contiene el ID, email y rol del usuario.
4. **Mensaje de Error Genérico:** Frente a correos inexistentes o contraseñas incorrectas, el sistema responde con `"Credenciales inválidas"`, evitando dar pistas a posibles atacantes sobre qué dato fue el incorrecto.

---

## CU-02: Gestionar Cuentas de Personal
* **Objetivo:** Permitir al Administrador registrar, listar, actualizar e inhabilitar cuentas de Médicos y Enfermeros.

### ⚙️ Lógica e Integridad Implementada:
1. **Control de Privilegios (RBAC - Role-Based Access Control):**
   * Todos los endpoints de este módulo están protegidos.
   * Requieren la cabecera `Authorization: Bearer <token>`.
   * **Solo se permite el acceso a usuarios con rol `'ADMINISTRATIVO'`**. Si un Médico o Enfermero intenta acceder, recibe un `403 Forbidden`.
2. **Validación de Formatos Estrictos (DTO):**
   * El **DNI** debe ser exactamente de 8 dígitos numéricos.
   * El **Email** debe ser institucional y contener el carácter `@`.
   * La **Especialidad** es obligatoria si el rol seleccionado es `'MEDICO'`.
3. **Blindaje contra Duplicados (Doble Capa):**
   * **En la Creación:** Verifica mediante el repositorio si el DNI o el Email ya existen en Supabase, devolviendo un error `400` limpio antes de ejecutar la inserción.
   * **En la Actualización:** Si se modifica el Email, valida que no esté en uso por otra cuenta, evitando excepciones de clave duplicada en la base de datos.
4. **Regla de Negocio Crítica (RNF-34):**
   * Impide la desactivación del último Administrador activo del sistema, garantizando que la plataforma nunca se quede sin administración.
5. **Inhabilitación Lógica:**
   * Al "eliminar" un usuario, no se borran físicamente sus datos para no perder históricos de auditoría. Se cambia su estado a `activo = false` (Inactivación Lógica).
6. **Generador Correlativo de Códigos:**
   * Genera de forma automática códigos secuenciales legibles (ej: `USU-0001`, `USU-0002`).

---

## CU-03: Gestionar Catálogo de Métricas Clínicas
* **Objetivo:** Administrar el catálogo base de variables fisiológicas (Temperatura, Presión Arterial, Ritmo Cardíaco, etc.) que se utilizarán en el monitoreo IoT.

### ⚙️ Lógica e Integridad Implementada:
1. **Principio de Menor Privilegio (Segmentación de Accesos):**
   * **Lectura (`GET /`):** Permitido para **Administrativos, Médicos y Enfermeros**, ya que los clínicos necesitan ver qué métricas existen para configurar alertas o ver el dashboard.
   * **Escritura (`POST, PUT, DELETE`):** Exclusivo para **Administrativos**, previniendo que personal clínico altere o elimine la estructura de datos del sistema por error.
2. **Validación de Rangos Clínicos Coherentes:**
   * El rango mínimo de la métrica debe ser positivo (`rangoMin >= 0`).
   * El rango máximo debe ser estrictamente superior al mínimo (`rangoMax > rangoMin`).
3. **Protección contra Colisiones de Código (`generarCodigo`):**
   * A diferencia del conteo básico, el repositorio busca la métrica con el número de código más alto (`order DESC, take 1`) y le suma `1` (ej: si borras `MET-0003`, la siguiente sigue siendo `MET-0006`). Esto evita colisiones de clave única cuando ocurren eliminaciones físicas.
4. **Prevención de Registros Huérfanos (Bloqueo de Borrado):**
   * Si una métrica está en uso por algún paciente (en la tabla `Umbral`) o tiene lecturas tomadas (en la tabla `Lectura`), **el sistema bloquea su eliminación física** lanzando un error amigable, protegiendo la integridad referencial de los históricos clínicos.
5. **Prevención de Nombres Duplicados:**
   * Valida la no existencia del nombre de la métrica tanto al crear una nueva como al renombrar una existente.

---

## CU-04: Registrar Paciente Crónico
* **Objetivo:** Registrar pacientes con enfermedades crónicas en el programa PADOMI, asignándoles un médico de cabecera responsable de su telemonitoreo.

### ⚙️ Lógica e Integridad Implementada:
1. **Control de Privilegios Segmentado (RBAC):**
   * El registro está restringido mediante JWT a los roles `'ADMINISTRATIVO'` (Admisión) y `'MEDICO'` (Responsable del diagnóstico clínico).
   * Los `'ENFERMERO'` son bloqueados con `403 Forbidden` si intentan registrar pacientes.
2. **Validación de Carga Laboral del Médico (RNF-20):**
   * Valida en el repositorio que el médico asignado no supere el límite máximo de **500 pacientes asignados**. Si se supera, el sistema bloquea el registro con un mensaje controlado para evitar sobrecarga clínica.
3. **Validación Existencial de Médico:**
   * Verifica que el UUID enviado en `medicoAsignadoId` exista físicamente en la base de datos de usuarios, evitando excepciones crudas de la base de datos.
4. **Verificación de Rol Médico Obligatorio:**
   * Garantiza que el usuario asignado tenga el rol clínico de `'MEDICO'`. Impide que pacientes sean asignados por error a enfermeros o administrativos.
5. **Formatos y Edades Clínicas Coherentes:**
   * El DNI del paciente debe tener exactamente **8 dígitos numéricos**.
   * La edad del paciente debe ser un valor lógico entre **0 y 120 años**.
6. **Evita DNI Duplicados:**
   * El DNI es único. Si se intenta registrar un paciente que ya existe, el sistema emite una respuesta clara de error.
7. **Generador Correlativo de Códigos:**
   * Genera de forma automática códigos correlativos legibles de pacientes (ej: `PAC-0001`, `PAC-0002`).

---

## CU-05: Gestionar Paciente (Ficha y Umbrales Clínicos)
* **Objetivo:** Consultar la ficha del paciente crónico y personalizar sus umbrales de alerta para el monitoreo IoT de constantes vitales.

### ⚙️ Lógica e Integridad Implementada:
1. **Control de Privilegios Segmentado (RBAC):**
   * **Lectura (`GET /`):** Permitido para `'ADMINISTRATIVO'`, `'MEDICO'` y `'ENFERMERO'` para asegurar que el personal asistencial pueda visualizar el estado de salud del paciente.
   * **Escritura (`PATCH /`):** Exclusivo para `'ADMINISTRATIVO'` y `'MEDICO'`. Los enfermeros están bloqueados con `403 Forbidden` para evitar modificaciones no autorizadas en planes clínicos.
2. **Auditoría de Modificación Inalterable (JWT):**
   * El ID del usuario que realiza la modificación (`medicoId`) se extrae directamente de la firma digital del token JWT, haciendo imposible su suplantación o falsificación en las solicitudes HTTP.
3. **Validación de Rangos Clínicos Consistentes (DTO):**
   * El valor mínimo del umbral debe ser positivo (`valorMin >= 0`).
   * El valor máximo del umbral debe ser estrictamente superior al mínimo (`valorMax > valorMin`).
4. **Validación de Consistencia con el Catálogo de Métricas:**
   * Verifica la existencia de la métrica en la base de datos antes de crear o actualizar el umbral.
   * **Control Clínico Estricto:** Valida que el umbral personalizado se encuentre estrictamente dentro de los rangos biológicos absolutos de la métrica (`valorMin >= metrica.rangoMin` y `valorMax <= metrica.rangoMax`), impidiendo la configuración de rangos imposibles o biológicamente absurdos.
5. **Blindaje contra Duplicidad de Umbrales:**
   * Evita la creación de registros redundantes mediante un validador en el DTO que impide enviar la misma métrica más de una vez en el cuerpo de la petición.
6. **Protección contra Campos Vacíos:**
   * Si se actualiza el diagnóstico, este no puede estar vacío ni contener solo espacios en blanco (mínimo 3 caracteres significativos).

---


## Medidas de Seguridad Transversales (Infraestructura API)
* **Protección Anti-DoS (Denegación de Servicio):** Configuración de un límite estricto de tamaño en el parser de Express (`express.json({ limit: '50kb' })`) en `app.ts` para rechazar cuerpos de petición inmensos de forma inmediata (`413 Payload Too Large`), protegiendo la RAM del servidor.
* **Interceptor de Errores de Sintaxis JSON:** Captura cualquier error de formato en el body (como comas huérfanas o comillas rotas) en la capa de parsing, respondiendo con un JSON estructurado de error en lugar de filtrar paths del servidor en páginas HTML.
* **Arquitectura Limpia (Clean Architecture):** Todo el código está dividido estrictamente en capas (Presentación/Controladores, Aplicación/Servicios, Dominio/Entidades y Repositorios de Infraestructura), logrando desacoplamiento total de la base de datos relacional PostgreSQL en Supabase.
