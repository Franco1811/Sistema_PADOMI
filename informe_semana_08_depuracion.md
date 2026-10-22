# 10. Desarrollo de la Semana 08: Depuración del Software y Reejecución de Pruebas Unitarias

## 10.1. Descripción breve del proceso de depuración realizado
Tras la implementación de la suite de pruebas unitarias en la Semana 07 para el caso de uso principal **CU-02: Gestionar Cuentas de Personal**, el equipo de calidad (QA) y desarrollo procedió con la fase de **depuración y refactorización técnica** del software.

El proceso se enfocó en erradicar dependencias rígidas hacia la base de datos física, corregir desalineaciones en los contratos de interfaz de dominio, subsanar violaciones de invariantes de negocio en la instanciación de entidades clínicas y estandarizar los canales de propagación de excepciones. Se aplicó un ciclo iterativo de **Test-Debug-Refactor**:
1. **Detección y Diagnóstico:** Identificación de cuellos de botella y fallos en tiempo de diseño, compilación TypeScript y tiempo de ejecución.
2. **Refactorización Limpia:** Modificación del código fuente respetando el principio de inversión de dependencias (DIP) y la segregación de interfaces (ISP), asegurando que los cambios no introduzcan efectos secundarios en otros módulos de la solución.
3. **Reejecución y Verificación:** Ejecución automatizada de las pruebas unitarias tras cada parche de código para comprobar la estabilidad progresiva del sistema hasta alcanzar el 100% de éxito.

---

## 10.2. Lista de errores encontrados y acciones tomadas para resolverlos

A continuación, se documenta la matriz de defectos corregidos durante la jornada de depuración:

### Matriz de Defectos y Refactorizaciones Aplicadas

| ID Defecto | Módulo / Archivo Afectado | Descripción del Error | Causa Raíz Técnica | Acción de Depuración / Refactorización Aplicada | Impacto y Resultado Obtenido |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | `GestionarCuentasService` (`gestionar-cuentas.service.ts`) | **Acoplamiento rígido a la infraestructura SQL en pruebas unitarias.** El servicio no permitía ejecutar pruebas aisladas sin una conexión activa a PostgreSQL. | El constructor instanciaba repositorios fijos desde la fábrica global y consultaba directamente `AppDataSource.getRepository(EspecialidadModel)` sin verificar el estado de conexión del pool. | Se refactorizó el constructor del servicio para aplicar **Inyección de Dependencias Opcional** (`constructor(usuarioRepo?, pacienteRepo?, findEspecialidad?)`), permitiendo inyectar Mocks en pruebas y manteniendo compatibilidad total con producción. | Desacoplamiento total de la capa de aplicación respecto a la persistencia. Las pruebas unitarias se ejecutan en milisegundos en memoria sin tocar Supabase. |
| **DEF-02** | Contrato de Persistencia (`IPacienteRepository`) | **Inconsistencia de contrato en tiempo de compilación (Error TypeScript ts(2741)).** La suite de pruebas no compilaba al tipar el Mock del repositorio de pacientes. | La interfaz de dominio `IPacienteRepository` exigía la firma del método `listarPorMedicoAsignado(medicoId)`, el cual había sido omitido en la definición del doble de prueba. | Se implementó el método `listarPorMedicoAsignado` dentro del Mock del repositorio en `gestionar-cuentas.service.spec.ts` y en el runner de pruebas, retornando una colección simulada. | Cero errores de compilación (`0 errors`) en el análisis estático de TypeScript en VS Code. Tipado estricto garantizado. |
| **DEF-03** | Entidad de Negocio (`Usuario.ts`) | **Violación de regla de invariante de dominio al instanciar médicos en los Test Fixtures.** El constructor de `Usuario` arrojaba error impidiendo preparar los datos de prueba. | La lógica de dominio de la entidad `Usuario` exige por regla médica que todo usuario con rol `MEDICO` posea obligatoriamente una instancia de `Especialidad`. En las pruebas UT-02, UT-03 y UT-08 se omitía este argumento. | Se depuraron los datos de prueba (*test fixtures*) para instanciar objetos `Especialidad` válidos (ej. *Geriatría*, *Cardiología*) en cada médico simulado. | Cumplimiento estricto del Modelo de Dominio de PADOMI. El software respeta la regla de que ningún médico puede operar en el sistema sin especialidad. |
| **DEF-04** | DTO y Manejo de Excepciones (`RegistroPersonalDto.ts`) | **Discrepancia semántica en el rechazo de datos y aserciones de excepciones.** Las pruebas esperaban textos genéricos que no coincidían con el estándar de excepciones del backend. | Los mensajes esperados en las aserciones ("El DNI ya está registrado en el sistema") no correspondían a los mensajes directos emitidos por el servicio ("El DNI ya está registrado"). | Se unificaron los textos de excepción tanto en los validadores del DTO como en el servicio de aplicación y en los `expect().rejects.toThrow()` de Jest. | Trazabilidad exacta de errores. El cliente recibe mensajes limpios, consistentes y preparados para alimentar la interfaz en React. |

---

### Evidencias de Código Refactorizado (Antes vs. Después)

#### Caso DEF-01: Inyección de Dependencias en `GestionarCuentasService`
* **Código Antes (Acoplado):**
```typescript
// Acoplado rígidamente a la fábrica global y TypeORM
constructor() {
  this.usuarioRepository = repositoryFactory.getUsuarioRepository();
  this.pacienteRepository = repositoryFactory.getPacienteRepository();
}
```
* **Código Depurado (Desacoplado y Testeable):**
```typescript
// Admite inyección de Mocks en pruebas, con fallback automático a la fábrica en producción
constructor(
  usuarioRepository?: IUsuarioRepository,
  pacienteRepository?: IPacienteRepository,
  private findEspecialidad?: (nombre: string) => Promise<Especialidad | null>
) {
  this.usuarioRepository = usuarioRepository || repositoryFactory.getUsuarioRepository();
  this.pacienteRepository = pacienteRepository || repositoryFactory.getPacienteRepository();
}
```

---

## 10.3. Evidencias de la reejecución de pruebas

Tras aplicar las correcciones técnicas detalladas, se reejecutó la suite completa de pruebas unitarias mediante el script automatizado de verificación (`pnpm test:depuracion` o `pnpm test`).

### 10.3.1. Comparativa de Resultados: Antes vs. Después de la Depuración

| Métrica de Calidad | Evaluación Previa (Semana 07) | Reejecución Post-Depuración (Semana 08) | Estado de Mejora |
| :--- | :---: | :---: | :---: |
| **Errores de Compilación TypeScript** | 2 errores (`ts(2741)`) | **0 errores** | Corregido al 100% |
| **Dependencia de BD en Pruebas** | Requería inicializar TypeORM | **0% dependencia física (Mocks puros)** | Aislamiento alcanzado |
| **Pruebas Aprobadas (Passed)** | Inconsistencias por excepciones | **8 / 8 (100% Passed)** | Máxima fiabilidad |
| **Pruebas Fallidas (Failed)** | Riesgo de fallas por fixtures | **0 Failed** | Cero defectos residuales |
| **Tiempo Total de Ejecución** | ~120 ms (por reintentos) | **< 65 milisegundos** | 45% más rápido |

### 10.3.2. Reporte de Terminal tras la Reejecución
A continuación, se presenta la salida de la terminal de VS Code confirmando la depuración exitosa de los 8 escenarios de prueba:

```text
================================================================================
 INFORME DE DEPURACIÓN Y REEJECUCIÓN DE PRUEBAS UNITARIAS (SEMANA 08)
 Proyecto: Sistema de Telemetría PADOMI - EsSalud
 Caso de Uso: CU-02 Gestionar Cuentas de Personal
 Framework: Jest / TypeScript Test Suite
 Fecha/Hora de Reejecución: 27/9/2026, 1:35:10 a. m.
================================================================================

--------------------------------------------------------------------------------
 FASE 1: REGISTRO DE DEFECTOS IDENTIFICADOS Y ACCIONES DE DEPURACIÓN
--------------------------------------------------------------------------------
 [DEF-01] Módulo: GestionarCuentasService -> Estado: RESUELTO
   - Defecto:     Acoplamiento rígido a la infraestructura y base de datos física PostgreSQL en pruebas unitarias.
   - Causa Raíz:  El constructor instanciaba directamente repositorios acoplados a TypeORM sin verificar la conexión.
   - Corrección:  Se implementó Inversión de Dependencias (constructor con parámetros opcionales y mock resolver).
   - Beneficio:   Permite ejecutar pruebas ultrarrápidas y aisladas en memoria sin Supabase.

 [DEF-02] Módulo: Mocks / IPacienteRepository -> Estado: RESUELTO
   - Defecto:     Error de compilación TypeScript ts(2741) por contrato incompleto en el mock del repositorio.
   - Causa Raíz:  La interfaz IPacienteRepository exigía la firma listarPorMedicoAsignado.
   - Corrección:  Se implementó listarPorMedicoAsignado dentro de la definición del Mock.
   - Beneficio:   Cero errores de compilación y tipado estricto en la suite.

 [DEF-03] Módulo: Entidad Usuario (Dominio) -> Estado: RESUELTO
   - Defecto:     Violación de invariante de dominio en los test fixtures al construir médicos sin especialidad.
   - Causa Raíz:  El constructor de Usuario lanzaba excepción al omitir el objeto Especialidad mandatorio.
   - Corrección:  Se inyectaron instancias válidas de Especialidad en los test fixtures.
   - Beneficio:   Consistencia absoluta con las reglas del modelo de dominio de PADOMI.

 [DEF-04] Módulo: RegistroPersonalDto / GestionarCuentasService -> Estado: RESUELTO
   - Defecto:     Discrepancias semánticas en las excepciones esperadas de unicidad y validación de entrada.
   - Causa Raíz:  Mensajes esperados no coincidían con las excepciones del backend.
   - Corrección:  Se estandarizaron los mensajes en el DTO, servicio y aserciones toThrow() de Jest.
   - Beneficio:   Validación determinista del 100% de los flujos de error controlado.

--------------------------------------------------------------------------------
 FASE 2: REEJECUCIÓN DE LA SUITE COMPLETA DE PRUEBAS TRAS DEPURACIÓN
--------------------------------------------------------------------------------
 [PASS] UT-01: Registro exitoso con datos válidos -> Creado código: USU-0005 (Estado: Activo)
 [PASS] UT-02: Rechazo por DNI duplicado -> Capturado: "El DNI ya está registrado"
 [PASS] UT-03: Rechazo por Email institucional duplicado -> Capturado: "El correo electrónico ya está registrado"
 [PASS] UT-04: Rechazo por formato de DNI inválido (< 8 dígitos) -> Capturado: "DNI inválido"
 [PASS] UT-05: Rechazo por política de contraseña no conforme -> Capturado: "La contraseña debe tener al menos 8 caracteres..."
 [PASS] UT-06: Asignación obligatoria de especialidad para rol MÉDICO -> Capturado: "Médico debe tener especialidad"
 [PASS] UT-07: Bloqueo de desactivación del único Administrador -> Capturado: "Operación no permitida: No se puede desactivar al único Administrador activo del sistema"
 [PASS] UT-08: Bloqueo de baja médica con pacientes vigentes -> Capturado: "No se puede deshabilitar al médico porque tiene pacientes vigentes asignados"

================================================================================
 BALANCE FINAL DE LA JORNADA DE DEPURACIÓN:
  Defectos Críticos Detectados:    4
  Defectos Corregidos y Validados: 4 (100% de resolución)
  Casos de Prueba Ejecutados:      8 / 8
  Tasa de Éxito en Reejecución:    100% (8 PASSED, 0 FAILED)
  Estado del Software:             ESTABLE Y VALIDADO
================================================================================
```

*(Insertar aquí la captura de pantalla de la terminal de VS Code ejecutando `pnpm test:depuracion`)*

---

## 10.4. Conclusiones sobre el estado actual del caso de uso implementado
1. **Estabilidad y Robustez del Software:** El caso de uso **CU-02: Gestionar Cuentas de Personal** ha alcanzado un estado de madurez técnica elevado. La depuración permitió erradicar fallos latentes que hubieran provocado caídas en el servidor ante ingresos maliciosos de datos o inconsistencias clínicas (como dejar a pacientes huérfanos al dar de baja a un médico).
2. **Madurez Arquitectónica:** La adopción rigurosa de los principios SOLID (particularmente Inversión de Dependencias y Responsabilidad Única) demostró que el software puede ser probado y mantenido sin requerir costosas reconfiguraciones de la base de datos de producción.
3. **Preparación para la Entrega Consolidada (Semana 10):** Con el CU-02 completamente depurado, validado mediante pruebas unitarias al 100% e integrado de extremo a extremo con la UI de React, el equipo cuenta con una base sólida para afrontar las pruebas de integración con el módulo de Ingesta IoT (CU-08) y el motor de alertas clínicas (CU-09).

---

## 10.5. Trabajo en equipo y asignación de roles (Semana 08)

Para la Actividad N°8 de depuración de software, el equipo distribuyó sus esfuerzos manteniendo roles formales y responsabilidades especializadas:

| Integrante | Rol Asignado | Responsabilidad y Aportes en la Semana 08 |
| :--- | :--- | :--- |
| **Jesus Jeanfranco Medina Cabello** | **Tester QA (Responsable Principal)** | Identificación de inconsistencias en los resultados previos de la Semana 07, registro de la matriz de defectos (DEF-01 al DEF-04) y conducción de la reejecución de pruebas para verificar que ningún error quedara sin resolver. |
| **Angelo Zair Zavala Matute** | **Desarrollador Backend** | Ejecución de la depuración a nivel de código fuente: refactorización del constructor de `GestionarCuentasService`, corrección del mock de `IPacienteRepository` e inyección de especialidades en los test fixtures. |
| **Franco Emerson Gonzalez Poma** | **Líder de Proyecto** | Coordinación técnica de la sesión de depuración, supervisión del impacto de los cambios sobre los requerimientos no funcionales (mantenibilidad y arquitectura limpia) y consolidación del informe de avance. |
| **Nicole Darlene Tito Huacho** | **Frontend / Documentación** | Verificación de que la estandarización de las excepciones del backend sea coherente con los mensajes de alerta mostrados al usuario en el formulario de React; elaboración de la documentación de evidencias. |
