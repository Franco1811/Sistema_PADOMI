# Roadmap de Desarrollo PADOMI

## Fase 1: Cimientos de Persistencia (La Base de Datos)
**Objetivo:** Transformar entidades lógicas en tablas físicas en Azure SQL usando TypeORM y poblar el sistema con datos falsos (Seeders).

- [ ] **Paso 1.1: Modelado TypeORM (shared/infrastructure/models)**
  - Crear archivos .model.ts para Usuario, Paciente, Metrica y Lectura.
  - Configurar restricciones como Unique Constraint (RNF-49) en métricas.
- [ ] **Paso 1.2: Conexión y Mappings (shared/infrastructure)**
  - Configurar data-source.ts para Azure SQL.
  - Desarrollar mapping.ts para traducir Modelos de DB a Entidades Puras.
- [ ] **Paso 1.3: Generación de Datos Ficticios (Seeders)**
  - Crear scripts en database/seeders/ para médicos, métricas y pacientes de prueba.
- [ ] **Paso 1.4: Pruebas Unitarias de Modelos y Seeders**
  - Implementar pruebas unitarias para modelos y scripts de seeders.

## Fase 2: Desarrollo del Monolito Modular (El Núcleo API)
**Objetivo:** Construir los CU administrativos (CU-01 al CU-05) y probarlos con Postman.

- [ ] **Paso 2.1: Módulo de Seguridad (CU-01)**
  - Programar login: DTOs, Bcrypt, JWT (RNF-68).
  - Validar seguridad de endpoints y sanitización de datos.
- [ ] **Paso 2.2: Módulo de Gestión (CU-02 y CU-03)**
  - CRUD para personal médico y catálogo de métricas clínicas.
- [ ] **Paso 2.3: Módulo de Pacientes (CU-04 y CU-05)**
  - Registrar paciente validando DNI (RNF-04) y código PAC-XXXX.
  - Configurar umbrales de riesgo personalizados (RNF-72).
- [ ] **Paso 2.4: Validación de Endpoints**
  - Usar Postman para documentar y verificar rutas HTTP.
- [ ] **Paso 2.5: Pruebas Unitarias y de Integración de API**
  - Implementar pruebas unitarias y de integración para los CU y endpoints.

## Fase 3: Escudo Serverless y Telemetría IoT
**Objetivo:** Manejar alta concurrencia de datos biométricos separando esta carga del servidor principal.

- [ ] **Paso 3.1: Azure Functions Setup (functions/ingesta-biometrica)**
  - Inicializar entorno Serverless para CU-08 (Ingesta) (RNF-23).
  - Validación estructural (RNF-06) y límite de 2MB (RNF-24).
- [ ] **Paso 3.2: Integración de Caché Ultrarrápida (Redis)**
  - Configurar Redis para métricas (RNF-75) y umbrales (RNF-05).
- [ ] **Paso 3.3: Motor de Reglas (CU-09)**
  - Lógica para clasificar riesgo usando Redis.
- [ ] **Paso 3.4: Pruebas Unitarias y de Carga en Serverless**
  - Implementar pruebas unitarias y de carga para Azure Functions y Redis.

## Fase 4: Tiempo Real y Frontend (React Dashboard)
**Objetivo:** Desarrollar la interfaz médica para visualizar pacientes y emergencias en tiempo real.

- [ ] **Paso 4.1: Conexión Bidireccional (WebSockets)**
  - Implementar Socket.io backend/frontend (RNF-30).
- [ ] **Paso 4.2: Interfaz del Dashboard (CU-06)**
  - Vista en React mostrando pacientes por riesgo.
- [ ] **Paso 4.3: Gestión de Crisis (CU-07)**
  - Botón "Marcar como Atendido" y bloqueo transaccional (RNF-52).
- [ ] **Paso 4.4: Pruebas Unitarias y de Integración Frontend**
  - Implementar pruebas unitarias y de integración para el dashboard React.

## Fase 5: Auditoría Transversal y Cierre
**Objetivo:** Pulir detalles normativos y legales antes de la presentación.

- [ ] **Paso 5.1: Logs de Auditoría Inmutables (CU-17)**
  - Registro de auditoría en casos críticos (RNF-03).
- [ ] **Paso 5.2: Pruebas de Carga Locales**
  - Simular envío de JSONs corruptos/válidos para tolerancia a fallos (RNF-44).
- [ ] **Paso 5.3: Seguridad y Revisión Final**
  - Validar JWT, protección de endpoints, sanitización y revisión de seguridad.
- [ ] **Paso 5.4: Documentación Técnica y Manuales**
  - Completar README, OpenAPI/Swagger y manuales de usuario.
- [ ] **Paso 5.5: CI/CD y Monitoreo**
  - Configurar pipelines de integración/despliegue continuo y monitoreo en producción.

---

**Punto actual:** _(Marca aquí el paso en el que te encuentras para llevar seguimiento)_
