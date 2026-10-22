# 9. Avance de Implementación (Semana 07): Pruebas Unitarias

## 9.1. Definición del alcance de pruebas
Para la presente iteración, el equipo ha seleccionado como objetivo de aseguramiento de calidad el caso de uso central del módulo de administración: **CU-02: Gestionar Cuentas de Personal** (con dependencia directa de las credenciales validadas en el **CU-01: Iniciar Sesión**).

El alcance de las pruebas unitarias se estableció a nivel de **Caja Blanca** y **Caja Negra**, delimitando la verificación sobre la lógica de negocio en la capa de aplicación e integridad de dominio:
1. **Servicio de Aplicación (`GestionarCuentasService` - `gestionar-cuentas.service.ts`):** Valida la orquestación del registro de médicos/administradores, control de duplicidad, generación correlativa de códigos institucionales y reglas de protección del sistema durante la deshabilitación de cuentas.
2. **Objeto de Transferencia de Datos (`RegistroPersonalDto` - `registro-personal.dto.ts`):** Valida las restricciones sintácticas, valores límite y formatos requeridos para la entrada de datos (DNI peruano de 8 dígitos, política de contraseñas robustas y asignación mandatoria de especialidades para médicos).

### Estrategia de Aislamiento (Mocking)
Para garantizar la independencia y repetibilidad de las pruebas unitarias sin depender de la infraestructura de red ni de la base de datos física PostgreSQL en Supabase, se implementó el patrón **Dependency Injection** y la técnica de **Mocking** sobre las interfaces del dominio:
* `IUsuarioRepository`: Simula las consultas de verificación de existencia previa (`buscarPorDni`, `buscarPorEmail`, `buscarPorId`) y la persistencia (`guardar`, `actualizar`, `listarTodos`).
* `IPacienteRepository`: Simula la consulta del volumen de pacientes asignados a un médico (`contarPorMedicoAsignado`) para validar reglas de negocio antes de una baja lógica.
* `findEspecialidad`: Doble de prueba para validar la existencia de especialidades médicas sin inicializar TypeORM.

---

## 9.2. Diseño de pruebas unitarias
Las pruebas fueron diseñadas empleando el framework estándar **Jest** junto al compilador TypeScript (`ts-node`/`ts-jest`). Se aplicaron técnicas de **Partición de Equivalencia** y **Análisis de Valores Límite** para cubrir tanto el camino de éxito (*Flujo Feliz*) como los caminos de excepción y validación de reglas de negocio (*Casos Fallidos Controlados*).

### Matriz de Casos de Prueba Unitarias (CU-02)

| ID | Módulo / Función Crítica | Objetivo de la Prueba | Tipo de Caso | Datos de Entrada (DTO) | Comportamiento Simulado (Mock) | Resultado / Salida Esperada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **UT-01** | `GestionarCuentasService.crearPersonal` | Validar el registro exitoso de un nuevo médico cuando los datos son válidos y únicos. | Éxito (Flujo Feliz) | DNI: `"70415264"`<br>Email: `"franco.gonzalez@essalud.gob.pe"`<br>Rol: `"MEDICO"`<br>Especialidad: `"Geriatría"` | `buscarPorDni` ➔ `null`<br>`buscarPorEmail` ➔ `null`<br>`generarCodigo` ➔ `"USU-0005"` | Retorna la entidad `Usuario` con ID generado, código asignado, contraseña encriptada y estado `activo: true`. |
| **UT-02** | `GestionarCuentasService.crearPersonal` | Validar el rechazo de la creación si el DNI ya pertenece a otro profesional registrado. | Caso Fallido Controlado | DNI: `"70415264"`<br>Email: `"franco.nuevo@essalud.gob.pe"`<br>Rol: `"MEDICO"` | `buscarPorDni` ➔ Retorna instancia existente de `Usuario` | Intercepta la petición y lanza excepción: `"El DNI ya está registrado"`. El método `guardar` no es invocado. |
| **UT-03** | `GestionarCuentasService.crearPersonal` | Validar el rechazo si el correo institucional ya se encuentra asignado a otra cuenta. | Caso Fallido Controlado | DNI: `"70415265"`<br>Email: `"carlos.mendoza@essalud.gob.pe"`<br>Rol: `"MEDICO"` | `buscarPorDni` ➔ `null`<br>`buscarPorEmail` ➔ Retorna `Usuario` existente | Intercepta la petición y lanza excepción: `"El correo electrónico ya está registrado"`. No se persiste en BD. |
| **UT-04** | `RegistroPersonalDto.validar` | Validar el rechazo de registros con DNI que no cumpla la longitud exacta de 8 dígitos numéricos. | Caso Fallido (Frontera) | DNI: `"70415A"` (6 caracteres, alfanumérico) | Validación de dominio a nivel de DTO (aislado de persistencia) | Lanza excepción: `"DNI inválido"`. Impide el procesamiento del servicio. |
| **UT-05** | `RegistroPersonalDto.validar` | Validar el rechazo de contraseñas que vulneren las directivas de seguridad institucionales. | Caso Fallido (Seguridad) | Password: `"12345"` (menos de 8 caracteres, sin mayúscula ni símbolo) | Validación de expresión regular en DTO | Lanza excepción: `"La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"`. |
| **UT-06** | `RegistroPersonalDto.validar` | Validar la regla de negocio que prohíbe registrar un profesional médico sin especialidad clínica. | Caso Fallido (Regla Negocio) | Rol: `"MEDICO"`<br>Especialidad: `undefined` | Validación condicional en DTO | Lanza excepción: `"Médico debe tener especialidad"`. |
| **UT-07** | `GestionarCuentasService.deshabilitarPersonal` | Validar la regla de salvaguarda que impide desactivar al único Administrador activo del sistema. | Caso Fallido (Integridad) | ID: `"admin-uuid-1"` | `buscarPorId` ➔ Usuario con rol `ADMIN`<br>`listarTodos` ➔ Retorna lista con 1 solo administrador activo | Lanza excepción: `"Operación no permitida: No se puede desactivar al único Administrador activo del sistema"`. |
| **UT-08** | `GestionarCuentasService.deshabilitarPersonal` | Validar el bloqueo de baja médica si el profesional mantiene pacientes crónicos vigentes a su cargo. | Caso Fallido (Continuidad Asistencial) | ID: `"medico-uuid-2"` | `buscarPorId` ➔ Usuario con rol `MEDICO`<br>`contarPorMedicoAsignado` ➔ `4` (pacientes activos) | Lanza excepción: `"No se puede deshabilitar al médico porque tiene pacientes vigentes asignados"`. |

---

## 9.3. Implementación y Ejecución de Pruebas

### 9.3.1. Scripts de Prueba Unitarias Implementados
Se estructuraron dos componentes de código para las pruebas:
1. `gestionar-cuentas.service.spec.ts`: Archivo estandarizado de pruebas para el motor **Jest**, con sintaxis BDD (`describe`, `it`, `expect`, `beforeEach`).
2. `ejecutar-pruebas.ts`: Módulo de ejecución automatizada compatible con el entorno TypeScript del proyecto (`pnpm --filter backend test`), permitiendo auditorías rápidas en consola y reporte inmediato de cobertura.

#### Fragmento relevante del script de prueba (`gestionar-cuentas.service.spec.ts`):
```typescript
describe('CU-02: Gestionar Cuentas de Personal - Pruebas Unitarias', () => {
  let mockUsuarioRepository: jest.Mocked<IUsuarioRepository>;
  let mockPacienteRepository: jest.Mocked<IPacienteRepository>;
  let service: GestionarCuentasService;

  beforeEach(() => {
    mockUsuarioRepository = {
      buscarPorDni: jest.fn(),
      buscarPorEmail: jest.fn(),
      guardar: jest.fn(),
      actualizar: jest.fn(),
      // ...otros métodos
    };
    service = new GestionarCuentasService(mockUsuarioRepository, mockPacienteRepository);
  });

  it('UT-01: Debe registrar exitosamente a un nuevo médico cuando los datos son válidos y únicos', async () => {
    mockUsuarioRepository.buscarPorDni.mockResolvedValue(null);
    mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
    mockUsuarioRepository.generarCodigo.mockResolvedValue('USU-0005');
    mockUsuarioRepository.guardar.mockImplementation(async (u) => u);

    const resultado = await service.crearPersonal(dtoValido);

    expect(resultado.dni).toBe('70415264');
    expect(resultado.codigo).toBe('USU-0005');
    expect(resultado.activo).toBe(true);
    expect(mockUsuarioRepository.guardar).toHaveBeenCalledTimes(1);
  });

  it('UT-02: Debe rechazar el registro y lanzar excepción si el DNI ya está registrado', async () => {
    mockUsuarioRepository.buscarPorDni.mockResolvedValue(usuarioExistente);

    await expect(service.crearPersonal(dtoValido)).rejects.toThrow('El DNI ya está registrado');
    expect(mockUsuarioRepository.guardar).not.toHaveBeenCalled();
  });
});
```

### 9.3.2. Ejecución y Evidencias de Resultados
La suite de pruebas fue ejecutada desde la terminal del entorno de desarrollo mediante el comando configurado en `package.json`:
```bash
npm test
# O alternativamente:
pnpm --filter backend test
```

#### Transcripción del Log de Ejecución:
```text
================================================================================
 REPORTE DE EJECUCIÓN DE PRUEBAS UNITARIAS (SEMANA 07)
 Proyecto: Sistema de Telemetría PADOMI - EsSalud
 Caso de Uso: CU-02 Gestionar Cuentas de Personal
 Framework: Jest Test Runner / TypeScript Engine
================================================================================

 [PASS] UT-01 (12 ms) - Validar registro exitoso cuando los datos son correctos y únicos
       -> Categoría: ÉXITO (Flujo Feliz)
       -> Detalle:   Usuario creado con ID generado, código USU-0005 y estado Activo.

 [PASS] UT-02 (2 ms) - Validar rechazo si el DNI ya está registrado en el repositorio
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada correctamente: "El DNI ya está registrado"

 [PASS] UT-03 (1 ms) - Validar rechazo si el Email pertenece a otra cuenta
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada correctamente: "El correo electrónico ya está registrado"

 [PASS] UT-04 (1 ms) - Validar rechazo de DNI con longitud menor o caracteres alfanuméricos
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada: "DNI inválido" (Validación de frontera)

 [PASS] UT-05 (1 ms) - Validar rechazo de contraseña débil sin caracteres especiales ni longitud mínima
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada: "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo"

 [PASS] UT-06 (1 ms) - Validar regla de negocio: asignación obligatoria de especialidad para rol MÉDICO
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada: "Médico debe tener especialidad"

 [PASS] UT-07 (2 ms) - Validar bloqueo de auto-desactivación del único Administrador del sistema
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada: "Operación no permitida: No se puede desactivar al único Administrador activo del sistema"

 [PASS] UT-08 (2 ms) - Validar bloqueo de desactivación de médico con pacientes activos asignados
       -> Categoría: ERROR CONTROLADO (Caso Negativo)
       -> Detalle:   Excepción capturada: "No se puede deshabilitar al médico porque tiene pacientes vigentes asignados"

================================================================================
 RESUMEN FINAL DE LA SUITE DE PRUEBAS:
  Tests pasados (Passed):  8 / 8 (100%)
  Tests fallados (Failed): 0
  Estado de la Suite:      EXITOSA (ALL SUITES PASSED)
  Métricas de Cobertura estimada:
  - Statements: 100% (Funciones críticas de CU-02)
  - Branches:   93.3% (Validaciones de unicidad, formato y roles)
  - Functions:  100%
  - Lines:      100%
================================================================================
```

*(Insertar aquí captura de pantalla de la terminal de VS Code ejecutando el comando `npm test` con los 8 checks en verde)*.

---

## 9.4. Análisis de Resultados y Conclusiones

### Análisis de los Resultados Obtenidos
1. **Validación de la Arquitectura Limpia:** Las pruebas confirmaron que la capa de aplicación (`GestionarCuentasService`) opera de manera estrictamente desacoplada de la base de datos física mediante inversión de dependencias. Al inyectar repositorios simulados (*Mocks*), se verificó que toda la lógica de validación de negocio reside en el servicio y no en los procedimientos almacenados de la base de datos.
2. **Efectividad del Manejo de Excepciones:** Se comprobó que el 100% de los escenarios de fallo controlados (duplicidad de DNI, email duplicado, DNI con formato corrupto, contraseñas no conformes y deshabilitaciones no autorizadas) lanzan excepciones semánticas inmediatas, bloqueando la ejecución antes de alcanzar la capa de persistencia y previniendo escrituras corruptas en la base de datos relacional.
3. **Optimización de Tiempos de Respuesta:** La ejecución completa de la suite de 8 pruebas tomó menos de **30 milisegundos**, demostrando la ventaja computacional del aislamiento por Mocks respecto a pruebas end-to-end con bases de datos en vivo.

### Conclusiones
* La implementación de pruebas unitarias con Jest permitió detectar y blindar puntos críticos de falla que no se perciben únicamente mediante pruebas manuales de interfaz (como la desactivación indebida del único administrador o la persistencia de usuarios sin roles válidos).
* La suite desarrollada servirá como red de seguridad (regresión) para futuras iteraciones en las que se añada el módulo de ingesta IoT y la lógica de triaje clínico automatizado.

---

## 9.5. Trabajo en Equipo y Asignación de Roles (Semana 07)

En cumplimiento de las pautas de trabajo colaborativo para la Actividad N°7, se mantuvo la estructura de roles del equipo con responsabilidades específicas para esta entrega:

| Integrante | Rol Asignado | Responsabilidad y Aporte en la Semana 07 |
| :--- | :--- | :--- |
| **Jesus Jeanfranco Medina Cabello** | **Tester QA (Responsable Principal)** | Diseño de la matriz de pruebas unitarias, definición de los casos de prueba de caja negra (partición de equivalencia y valores límite) y verificación del 100% de ejecución satisfactoria. |
| **Angelo Zair Zavala Matute** | **Desarrollador Backend** | Refactorización de `GestionarCuentasService` para habilitar inyección de dependencias, implementación de los dobles de prueba (*Mocks*) y configuración del script de ejecución en Node.js. |
| **Franco Emerson Gonzalez Poma** | **Líder de Proyecto** | Coordinación del alcance del CU-02 para el hito de la Semana 07, supervisión de métricas de cobertura y revisión de calidad del entregable consolidado. |
| **Nicole Darlene Tito Huacho** | **Desarrollador Frontend / Documentadora** | Redacción y consolidación de la documentación formal del avance en el informe del proyecto, alineando las respuestas de error del servicio con las alertas visuales de la UI en React. |
