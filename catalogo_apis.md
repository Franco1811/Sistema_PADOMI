# Catálogo de APIs REST - Sistema de Telemetría PADOMI

Este documento es tu "chuleta" o mapa principal para saber qué consultar desde **Thunder Client** o **Postman** durante tu presentación.

> **Sobre los IDs (UUID vs Código Corto):**
> En todas las URLs y JSONs donde veas `:id` o `pacienteId`, **SIEMPRE debes usar el código largo (UUID)** (ej. `AF9E4BA9-3CEC...`). El código corto (`PAC-0001`) es puramente visual para que el médico lo lea en la pantalla de React, pero las bases de datos relacionales seguras siempre se comunican mediante sus UUIDs reales.

---

### CU-02: Gestionar Personal (Médicos, Enfermeros)
Sirve para registrar a los profesionales de la salud.

* **Listar Personal**
  * `GET http://localhost:3000/api/personal`
* **Crear Personal**
  * `POST http://localhost:3000/api/personal`
* **Actualizar Personal**
  * `PUT http://localhost:3000/api/personal/:id`

---

### CU-03: Gestionar Métricas
Sirve para administrar el catálogo base (Presión Arterial, Ritmo Cardíaco, Temperatura, etc).

* **Listar todas las Métricas**
  * `GET http://localhost:3000/api/metricas`
* **Crear Métrica**
  * `POST http://localhost:3000/api/metricas`
* **Actualizar Métrica**
  * `PUT http://localhost:3000/api/metricas/:id`
* **Eliminar Métrica**
  * `DELETE http://localhost:3000/api/metricas/:id`

---

### CU-04: Registro de Paciente
Sirve para que admisión o el médico registre a un nuevo paciente crónico.

* **Crear Paciente**
  * `POST http://localhost:3000/api/pacientes/registro`
  * *(Requiere pasar el `medicoAsignadoId` en el JSON).*

---

### CU-05: Gestionar Perfil del Paciente (Umbrales)
Sirve para configurar los límites biométricos peligrosos de cada paciente (ej. "Para Juan, más de 140 es peligroso").

* **Ver Perfil y sus Umbrales actuales**
  * `GET http://localhost:3000/api/pacientes/perfil/:id`
* **Configurar Umbrales / Diagnóstico**
  * `PATCH http://localhost:3000/api/pacientes/perfil/:id`

---

### CU-06: Monitorear Dashboard
Es el "cerebro" de solo lectura que usará la página principal del frontend.

* **Obtener data del Dashboard**
  * `GET http://localhost:3000/api/dashboard`
  * *(Puedes probar filtrando por médico añadiendo parámetros: `http://localhost:3000/api/dashboard?medicoId=UUID_DEL_MEDICO`)*

---

### CU-07: Atender Emergencia
Sirve para que el médico, al ver una alerta roja, presione el botón "Atender" en el frontend y cambie el estado de la alerta.

* **Atender Alerta**
  * `POST http://localhost:3000/api/alertas/:id/atender`
  * *(Aquí el `:id` de la URL es el UUID de la ALERTA, no del paciente)*.

---

### CU-08: Ingestar Datos
Simula a los dispositivos IoT (smartwatches o tensiómetros wifi) enviando datos en tiempo real al sistema.

* **Enviar Lectura**
  * `POST http://localhost:3000/api/ingesta`

---

### CU-09: Procesar Reglas Médicas
> **NOTA:** **Este Caso de Uso NO tiene un endpoint HTTP.** Como explicamos antes, se ejecuta solo en segundo plano a través de eventos internos de Node.js cuando el CU-08 guarda una lectura. Por lo tanto, no se puede llamar desde Thunder Client.
