# 11. Desarrollo de la Semana 09: Diseño de Casos de Prueba para Evaluar la Funcionalidad del Software

## 11.1. Definición del Alcance de Pruebas

En concordancia con los lineamientos de la **Actividad N°9**, el equipo de aseguramiento de la calidad (QA) y desarrollo procedió con el **Diseño Formal de Casos de Prueba Funcionales de Caja Negra** para evaluar la totalidad de los módulos transaccionales (CRUDs) del **Sistema de Telemetría y Gestión de Alertas para Salud Crítica (PADOMI - EsSalud)**.

El objetivo central de este hito es diseñar y formalizar las pruebas utilizando las técnicas de **Partición de Clases de Equivalencia** y **Análisis de Valores Límite**, garantizando una correspondencia estructural 1 a 1 entre las entradas analizadas, sus fronteras y los casos de prueba unitarias e integración resultantes.

### Módulos y CRUDs Evaluados en el Alcance:
1. **Módulo 01 (CRUD 1): Gestión de Cuentas de Personal Médico y Administrativo (`CU-02` / `CU-01`):** Mantenimiento de identidades clínicas: DNI, Nombres, Apellidos, Correo institucional, Contraseña, Rol de Usuario y Especialidad Médica.
2. **Módulo 02 (CRUD 2): Registro y Gestión de Pacientes Crónicos (`CU-04` / `CU-05`):** Empadronamiento clínico en PADOMI: DNI de Paciente, Nombres, Apellidos, Edad, Diagnóstico Clínico, Médico Tratante Asignado y Teléfono de Contacto.
3. **Módulo 03 (CRUD 3): Catálogo de Métricas Clínicas y Umbrales de Riesgo (`CU-03`):** Parametrización de signos vitales: Código de Métrica (`MET-XXXX`), Denominación del Signo Vital, Unidad de Medida, Rango Mínimo (`rangoMin`) y Rango Máximo (`rangoMax`).
4. **Módulo 04 (CRUD 4): Ingesta de Telemetría IoT y Gestión de Alertas Críticas (`CU-08` / `CU-09` / `CU-07`):** Recepción y procesamiento en tiempo real: ID de Paciente, ID de Métrica, Valor Biométrico Censado, Timestamp (Fecha/Hora), Tamaño de Carga JSON y Acción de Atención de Alerta.

---

## 11.2. Módulo 01: CRUD de Gestión de Cuentas de Personal (`CU-02`)

### 11.2.1. Clases de Equivalencia

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **DNI** | **1.** Numérico de exactamente 8 dígitos (ej. `70415264`, `45812048`) | **2.** Longitud menor a 8 dígitos<br>**3.** Longitud mayor a 8 dígitos<br>**4.** Contiene letras o caracteres alfanuméricos<br>**5.** Contiene símbolos o caracteres especiales<br>**6.** Vacío o nulo |
| **Nombres** | **7.** Cadena alfabética de 2 a 50 caracteres (ej. `Carlos Alberto`, `Franco Emerson`) | **8.** Menor a 2 caracteres<br>**9.** Mayor a 50 caracteres<br>**10.** Contiene números o dígitos<br>**11.** Contiene símbolos o caracteres especiales<br>**12.** Vacío o nulo |
| **Apellidos** | **13.** Cadena alfabética de 2 a 50 caracteres (ej. `Mendoza Ramos`, `Gonzalez Poma`) | **14.** Menor a 2 caracteres<br>**15.** Mayor a 50 caracteres<br>**16.** Contiene números o dígitos<br>**17.** Contiene símbolos o caracteres especiales<br>**18.** Vacío o nulo |
| **Correo Institucional** | **19.** Formato de correo válido con dominio institucional (ej. `usuario@essalud.gob.pe`, `usuario@padomi.com.pe`) | **20.** Formato sin símbolo `@`<br>**21.** Sin dominio o dominio comercial no autorizado (ej. `@gmail.com`)<br>**22.** Mayor a 100 caracteres de longitud<br>**23.** Vacío o nulo |
| **Contraseña** | **24.** Cadena de 8 a 30 caracteres con al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo especial | **25.** Longitud menor a 8 caracteres<br>**26.** Longitud mayor a 30 caracteres<br>**27.** Sin mayúsculas<br>**28.** Sin números<br>**29.** Sin caracteres especiales<br>**30.** Vacío o nulo |
| **Rol de Usuario** | **31.** Rol reconocido en el sistema: `"ADMIN"` o `"MEDICO"` | **32.** Rol no contemplado en RBAC (ej. `"ENFERMERO"`, `"PACIENTE"`)<br>**33.** Vacío o no seleccionado |
| **Especialidad Médica** | **34.** Cadena de especialidad seleccionada válida si el rol es `"MEDICO"` (ej. `Geriatría`, `Cardiología`)<br>**35.** Valor nulo / no requerido si el rol es `"ADMIN"` | **36.** Vacío o no seleccionado cuando el rol es `"MEDICO"`<br>**37.** Especialidad no existente en el catálogo del sistema |

---

### 11.2.2. Valores Límite
Se evalúan exactamente las mismas entradas del formulario, identificando los valores en la frontera de aceptación y rechazo.

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **DNI** | **38.** Longitud 8 dígitos (ej. `70415264`) | **39.** Longitud 7 dígitos (frontera inferior - 1)<br>**40.** Longitud 9 dígitos (frontera superior + 1) |
| **Nombres** | **41.** Longitud 2 caracteres (límite inferior)<br>**42.** Longitud 50 caracteres (límite superior) | **43.** Longitud 1 carácter<br>**44.** Longitud 51 caracteres |
| **Apellidos** | **45.** Longitud 2 caracteres (límite inferior)<br>**46.** Longitud 50 caracteres (límite superior) | **47.** Longitud 1 carácter<br>**48.** Longitud 51 caracteres |
| **Correo Institucional** | **49.** Longitud 10 caracteres (ej. `a@padomi.pe`)<br>**50.** Longitud 100 caracteres (límite superior) | **51.** Longitud 0 (Vacío)<br>**52.** Longitud 101 caracteres |
| **Contraseña** | **53.** Longitud 8 caracteres (ej. `Adm2026!`)<br>**54.** Longitud 30 caracteres (límite superior) | **55.** Longitud 7 caracteres (frontera inferior - 1)<br>**56.** Longitud 31 caracteres (frontera superior + 1) |
| **Rol de Usuario** | **57.** (31) 1 rol válido seleccionado | **58.** (33) 0 roles seleccionados |
| **Especialidad Médica** | **59.** (34, 35) 1 especialidad seleccionada para Médico / Nulo para Admin | **60.** (36) 0 especialidades seleccionadas para rol Médico |

---

### 11.2.3. Casos de Prueba Unitarias por Campo

#### Casos de Prueba Unitaria: DNI
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `70415264` | 1, 38 | - | • Seleccionar campo DNI<br>• Digitar código DNI<br>• Pasar a siguiente campo | DNI Aceptado |
| `7041526` | - | 2, 39 | • Seleccionar campo DNI<br>• Digitar 7 números<br>• Pasar a siguiente campo | Error: Sólo se permiten números de 8 dígitos |
| `704152649` | - | 3, 40 | • Seleccionar campo DNI<br>• Digitar 9 números<br>• Pasar a siguiente campo | Error: Sólo se permiten números de 8 dígitos |
| `7041526A` | - | 4 | • Seleccionar campo DNI<br>• Digitar alfanumérico<br>• Pasar a siguiente campo | Error: Sólo se permiten números |
| `7041-526` | - | 5 | • Seleccionar campo DNI<br>• Digitar símbolos<br>• Pasar a siguiente campo | Error: Sólo se permiten números |
| `[Vacío]` | - | 6 | • Seleccionar campo DNI<br>• Dejar en blanco<br>• Pasar a siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Nombres
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Carlos Alberto` | 7 | - | • Seleccionar campo Nombres<br>• Digitar nombre<br>• Pasar a siguiente campo | Nombre Aceptado |
| `Ed` (2 caracteres) | 7, 41 | - | • Seleccionar campo Nombres<br>• Digitar nombre de 2 caracteres<br>• Siguiente | Nombre Aceptado |
| `Juan Carlos de la Santisima Trinidad Ruiz Gonzales` (50 car.) | 7, 42 | - | • Seleccionar campo Nombres<br>• Digitar nombre de 50 caracteres<br>• Siguiente | Nombre Aceptado |
| `A` (1 carácter) | - | 8, 43 | • Seleccionar campo Nombres<br>• Digitar 1 carácter<br>• Siguiente | Error: Nombre debe tener entre 2 y 50 caracteres |
| `Juan Carlos de la Santisima Trinidad Ruiz Gonzales X` (51 car.) | - | 9, 44 | • Seleccionar campo Nombres<br>• Digitar 51 caracteres<br>• Siguiente | Error: Nombre debe tener entre 2 y 50 caracteres |
| `Carlos 2do` | - | 10 | • Seleccionar campo Nombres<br>• Digitar nombre con números<br>• Siguiente | Error: Sólo se permiten letras |
| `Carlos@Médico` | - | 11 | • Seleccionar campo Nombres<br>• Digitar nombre con símbolos<br>• Siguiente | Error: Sólo se permiten letras |
| `[Vacío]` | - | 12 | • Seleccionar campo Nombres<br>• Dejar en blanco<br>• Siguiente | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Apellidos
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Mendoza Ramos` | 13 | - | • Seleccionar campo Apellidos<br>• Digitar apellidos<br>• Siguiente campo | Apellidos Aceptados |
| `Oz` (2 caracteres) | 13, 45 | - | • Seleccionar campo Apellidos<br>• Digitar apellido de 2 caracteres<br>• Siguiente | Apellidos Aceptados |
| `Castro` | 13 | - | • Seleccionar campo Apellidos<br>• Digitar apellido<br>• Siguiente | Apellidos Aceptados |
| `O` (1 carácter) | - | 14, 47 | • Seleccionar campo Apellidos<br>• Digitar 1 carácter<br>• Siguiente | Error: Apellidos deben tener entre 2 y 50 caracteres |
| `Mendoza Ramos 123` | - | 16 | • Seleccionar campo Apellidos<br>• Digitar con números<br>• Siguiente | Error: Sólo se permiten letras |
| `[Vacío]` | - | 18 | • Seleccionar campo Apellidos<br>• Dejar en blanco<br>• Siguiente | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Correo Institucional
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `carlos.mendoza@essalud.gob.pe` | 19 | - | • Seleccionar campo Correo<br>• Digitar email<br>• Siguiente campo | Correo Aceptado |
| `carlos.mendoza_essalud.gob.pe` | - | 20 | • Seleccionar campo Correo<br>• Digitar sin arroba<br>• Siguiente campo | Error: Formato de correo inválido |
| `carlos.mendoza@gmail.com` | - | 21 | • Seleccionar campo Correo<br>• Digitar correo comercial<br>• Siguiente campo | Error: Debe ingresar correo institucional |
| `[Vacío]` | - | 23, 51 | • Seleccionar campo Correo<br>• Dejar en blanco<br>• Siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Contraseña
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Admin2026@Safe!` | 24 | - | • Seleccionar campo Contraseña<br>• Digitar clave robusta<br>• Siguiente | Contraseña Aceptada |
| `Adm2026!` (8 caracteres) | 24, 53 | - | • Seleccionar campo Contraseña<br>• Digitar clave de 8 caracteres<br>• Siguiente | Contraseña Aceptada |
| `Adm202!` (7 caracteres) | - | 25, 55 | • Seleccionar campo Contraseña<br>• Digitar clave de 7 caracteres<br>• Siguiente | Error: La contraseña debe tener al menos 8 caracteres |
| `admin2026@safe!` | - | 27 | • Seleccionar campo Contraseña<br>• Digitar clave sin mayúscula<br>• Siguiente | Error: Requiere al menos una mayúscula |
| `AdminSafe@Password` | - | 28 | • Seleccionar campo Contraseña<br>• Digitar clave sin números<br>• Siguiente | Error: Requiere al menos un número |
| `Admin2026Safe` | - | 29 | • Seleccionar campo Contraseña<br>• Digitar clave sin símbolos<br>• Siguiente | Error: Requiere al menos un símbolo especial |
| `[Vacío]` | - | 30 | • Seleccionar campo Contraseña<br>• Dejar en blanco<br>• Siguiente | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Rol de Usuario y Especialidad
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Rol: MEDICO, Especialidad: Geriatría` | 31, 34, 57, 59 | - | • Seleccionar rol Médico<br>• Seleccionar especialidad<br>• Siguiente | Rol y Especialidad Aceptados |
| `Rol: ADMIN, Especialidad: [Ninguna]` | 31, 35, 57, 59 | - | • Seleccionar rol Administrador<br>• Dejar sin especialidad<br>• Siguiente | Rol Administrador Aceptado |
| `Rol: ENFERMERO, Especialidad: [Ninguna]` | - | 32 | • Seleccionar rol no permitido<br>• Intentar validar | Error: Rol no permitido |
| `Rol: MEDICO, Especialidad: [Vacío]` | 31 | 36, 60 | • Seleccionar rol Médico<br>• No seleccionar especialidad<br>• Siguiente | Error: Médico debe tener especialidad |
| `Rol: [Vacío], Especialidad: [Vacío]` | - | 33, 58 | • No seleccionar rol<br>• Intentar validar | Error: Campo obligatorio |

---

### 11.2.4. Casos de Prueba de Integración: CRUD de Personal Médico

| ID | Casos de Prueba de Integración (Entrada CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | `70415264, Franco Emerson, Gonzalez Poma, franco.gonzalez@essalud.gob.pe, Medico2026@!, MEDICO, Geriatría` | 1, 7, 13, 19, 24, 31, 34, 38, 57, 59 | - | Llenar formulario -> Registrar Personal | Personal médico registrado exitosamente.<br>Código generado: USU-0005. |
| **2** | `72839402, Nicole Darlene, Tito Huacho, nicole.tito@essalud.gob.pe, Admin2026@Root!, ADMIN, [Ninguna]` | 1, 7, 13, 19, 24, 31, 35, 38, 57, 59 | - | Llenar formulario -> Registrar Personal | Administrador registrado exitosamente.<br>Código generado: USU-0006. |
| **3** | `45812048, Carlos, Mendoza, carlos.mendoza@essalud.gob.pe, Medico2026@!, MEDICO, Cardiología` | 1, 7, 13, 19, 24, 31, 34, 38, 57, 59 | - | Llenar formulario -> Registrar Personal | Personal médico registrado exitosamente.<br>Código generado: USU-0007. |
| **4** | `7041526, Angelo, Zavala, angelo.zavala@gmail.com, 12345, MEDICO, [Vacío]` | 7, 13, 31 | 2, 21, 25, 36, 39, 55, 60 | Llenar formulario -> Registrar Personal | Error: DNI debe tener 8 dígitos.<br>Error: Correo no institucional.<br>Error: Clave insegura.<br>Error: Falta especialidad. |
| **5** | `70415264, Jesus, Medina, jesus.medina@essalud.gob.pe, Medico2026@!, MEDICO, Geriatría` *(DNI repetido)* | 7, 13, 19, 24, 31, 34 | 1 *(Colisión)* | Llenar formulario -> Registrar Personal | Error: El DNI ya está registrado. |
| **6** | `88888881, Laura, Reyes, laura.reyes@essalud.gob.pe, Clave123@Safe, ENFERMERO, [Ninguna]` | 1, 7, 13, 19, 24 | 32 | Llenar formulario -> Registrar Personal | Error: Rol inválido. |

---

## 11.3. Módulo 02: CRUD de Registro y Gestión de Pacientes Crónicos (`CU-04`)

### 11.3.1. Clases de Equivalencia

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **DNI Paciente** | **61.** Numérico de exactamente 8 dígitos (ej. `10234567`) | **62.** Longitud menor a 8 dígitos<br>**63.** Longitud mayor a 8 dígitos<br>**64.** Alfanumérico o letras<br>**65.** Símbolos especiales<br>**66.** Vacío o nulo |
| **Nombres** | **67.** Cadena alfabética de 2 a 50 caracteres (ej. `María Elena`, `Humberto`) | **68.** Menor a 2 caracteres<br>**69.** Mayor a 50 caracteres<br>**70.** Contiene números o dígitos<br>**71.** Símbolos o caracteres especiales<br>**72.** Vacío o nulo |
| **Apellidos** | **73.** Cadena alfabética de 2 a 50 caracteres (ej. `Flores Quispe`, `Morales Ruiz`) | **74.** Menor a 2 caracteres<br>**75.** Mayor a 50 caracteres<br>**76.** Contiene números o dígitos<br>**77.** Símbolos o caracteres especiales<br>**78.** Vacío o nulo |
| **Edad (Años)** | **79.** Entero positivo entre 1 y 120 años (Población geriátrica habitual: 60 a 105) | **80.** Negativo (< 0)<br>**81.** Igual a 0<br>**82.** Mayor a 120 años<br>**83.** Decimal (ej. `72.5`)<br>**84.** Caracteres no numéricos<br>**85.** Vacío o nulo |
| **Diagnóstico Clínico** | **86.** Cadena de texto de 5 a 255 caracteres (ej. `Hipertensión Arterial Grado II e Insuficiencia Cardíaca`) | **87.** Menor a 5 caracteres<br>**88.** Mayor a 255 caracteres<br>**89.** Vacío o nulo |
| **Médico Asignado** | **90.** UUID válido de médico existente y en estado activo en el sistema | **91.** Formato UUID inválido<br>**92.** UUID de usuario con rol ADMIN (no médico)<br>**93.** UUID de médico dado de baja<br>**94.** Vacío o no seleccionado |
| **Teléfono de Contacto** | **95.** Numérico de 9 dígitos iniciando con '9' (ej. `987654321`) | **96.** Menor a 9 dígitos<br>**97.** Mayor a 9 dígitos<br>**98.** No inicia con dígito 9<br>**99.** Alfanumérico o símbolos<br>**100.** Vacío o nulo |

---

### 11.3.2. Valores Límite
Se evalúan exactamente las mismas entradas del padrón de pacientes, verificando límites de longitud y rangos numéricos.

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **DNI Paciente** | **101.** Longitud 8 dígitos (ej. `10234567`) | **102.** Longitud 7 dígitos (frontera inferior - 1)<br>**103.** Longitud 9 dígitos (frontera superior + 1) |
| **Nombres** | **104.** Longitud 2 caracteres (límite inferior)<br>**105.** Longitud 50 caracteres (límite superior) | **106.** Longitud 1 carácter<br>**107.** Longitud 51 caracteres |
| **Apellidos** | **108.** Longitud 2 caracteres (límite inferior)<br>**109.** Longitud 50 caracteres (límite superior) | **110.** Longitud 1 carácter<br>**111.** Longitud 51 caracteres |
| **Edad (Años)** | **112.** 1 año (límite inferior válido)<br>**113.** 120 años (límite superior válido) | **114.** 0 años (frontera inferior inválida)<br>**115.** 121 años (frontera superior inválida)<br>**116.** -1 año |
| **Diagnóstico Clínico** | **117.** Longitud 5 caracteres (límite inferior)<br>**118.** Longitud 255 caracteres (límite superior) | **119.** Longitud 4 caracteres<br>**120.** Longitud 256 caracteres |
| **Médico Asignado** | **121.** (90) 1 médico seleccionado con rol MÉDICO | **122.** (94) 0 médicos seleccionados |
| **Teléfono de Contacto** | **123.** Longitud 9 dígitos | **124.** Longitud 8 dígitos<br>**125.** Longitud 10 dígitos |

---

### 11.3.3. Casos de Prueba Unitarias por Campo

#### Casos de Prueba Unitaria: DNI Paciente
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `10234567` | 61, 101 | - | • Ingresar DNI del paciente<br>• Pasar a siguiente campo | DNI Paciente Aceptado |
| `1023456` | - | 62, 102 | • Ingresar 7 dígitos<br>• Pasar a siguiente campo | Error: DNI debe contener 8 dígitos |
| `102345678` | - | 63, 103 | • Ingresar 9 dígitos<br>• Pasar a siguiente campo | Error: DNI no debe exceder 8 dígitos |
| `1023456X` | - | 64 | • Ingresar caracteres alfanuméricos<br>• Siguiente campo | Error: Sólo se permiten números |
| `[Vacío]` | - | 66 | • Dejar en blanco<br>• Siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Nombres y Apellidos
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Humberto` | 67 | - | • Ingresar nombre<br>• Siguiente campo | Nombre Aceptado |
| `Morales Ruiz` | 73 | - | • Ingresar apellidos<br>• Siguiente campo | Apellidos Aceptados |
| `Al` (2 caracteres) | 67, 104 | - | • Ingresar nombre de 2 letras<br>• Siguiente campo | Nombre Aceptado |
| `A` (1 carácter) | - | 68, 106 | • Ingresar 1 letra<br>• Siguiente campo | Error: Mínimo 2 caracteres |
| `Morales 2do` | - | 76 | • Ingresar apellido con números<br>• Siguiente campo | Error: Sólo se permiten letras |
| `[Vacío]` | - | 72, 78 | • Dejar en blanco<br>• Siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Edad
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `78` | 79 | - | • Digitar edad<br>• Siguiente campo | Edad Aceptada (Rango geriátrico) |
| `1` (1 año) | 79, 112 | - | • Digitar 1 año<br>• Siguiente campo | Edad Aceptada (Límite inferior) |
| `120` (120 años) | 79, 113 | - | • Digitar 120 años<br>• Siguiente campo | Edad Aceptada (Límite superior) |
| `0` | - | 81, 114 | • Digitar 0 años<br>• Siguiente campo | Error: Edad mínima es 1 año |
| `121` | - | 82, 115 | • Digitar 121 años<br>• Siguiente campo | Error: Edad máxima es 120 años |
| `-5` | - | 80, 116 | • Digitar número negativo<br>• Siguiente campo | Error: La edad no puede ser negativa |
| `78.5` | - | 83 | • Digitar decimal<br>• Siguiente campo | Error: La edad debe ser un número entero |

#### Casos de Prueba Unitaria: Diagnóstico Clínico
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Hipertensión Arterial Grado II` | 86 | - | • Ingresar diagnóstico<br>• Siguiente campo | Diagnóstico Aceptado |
| `EPOC` (4 caracteres) | - | 87, 119 | • Ingresar diagnóstico breve<br>• Siguiente campo | Error: Diagnóstico debe tener al menos 5 caracteres |
| `[Vacío]` | - | 89 | • Dejar en blanco<br>• Siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Médico Asignado y Teléfono
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Médico: med-uuid-001, Teléfono: 987654321` | 90, 95, 121, 123 | - | • Seleccionar médico<br>• Digitar teléfono de 9 dígitos | Médico y Teléfono Aceptados |
| `Médico: [Vacío]` | - | 94, 122 | • No seleccionar médico<br>• Intentar guardar | Error: Debe asignar un médico tratante |
| `Médico: usr-admin-099` | - | 92 | • Seleccionar usuario con rol ADMIN<br>• Intentar guardar | Error: El usuario asignado debe tener rol MÉDICO |
| `Teléfono: 98765432` (8 dígitos) | - | 96, 124 | • Digitar teléfono de 8 dígitos<br>• Siguiente campo | Error: Teléfono debe tener 9 dígitos |
| `Teléfono: 456789123` (Inicia con 4) | - | 98 | • Digitar teléfono no móvil<br>• Siguiente campo | Error: Teléfono debe iniciar con '9' |

---

### 11.3.4. Casos de Prueba de Integración: CRUD de Pacientes Crónicos

| ID | Casos de Prueba de Integración (Entrada CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **7** | `10234567, Humberto, Morales Ruiz, 78, Hipertensión Crónica y EPOC, med-uuid-001, 987654321` | 61, 67, 73, 79, 86, 90, 95, 101, 121, 123 | - | Llenar formulario -> Registrar Paciente | Paciente registrado exitosamente.<br>Código generado: PAC-0001. |
| **8** | `40556677, Teresa, Ramos Diaz, 82, Diabetes Mellitus Tipo 2, med-uuid-002, 976543210` | 61, 67, 73, 79, 86, 90, 95, 101, 121, 123 | - | Llenar formulario -> Registrar Paciente | Paciente registrado exitosamente.<br>Código generado: PAC-0002. |
| **9** | `10234567, Carlos, Quispe Silva, 69, Cardiopatía Isquémica, med-uuid-001, 999888777` *(DNI Duplicado)* | 67, 73, 79, 86, 90, 95 | 61 *(Colisión)* | Llenar formulario -> Registrar Paciente | Error: El DNI del paciente ya se encuentra registrado. |
| **10** | `1023456, A, Morales, -3, HTA, med-uuid-001, 48765432` | 73, 90 | 62, 68, 80, 87, 96, 98, 102, 106, 116, 119, 124 | Llenar formulario -> Registrar Paciente | Error: DNI inválido.<br>Error: Nombre muy corto.<br>Error: Edad negativa.<br>Error: Diagnóstico corto.<br>Error: Teléfono inválido. |
| **11** | `71239845, Jorge, Benitez Paz, 74, Arritmia Cardíaca, usr-admin-099, 991223344` | 61, 67, 73, 79, 86, 95 | 92 | Llenar formulario -> Registrar Paciente | Error: El usuario seleccionado debe tener rol MÉDICO. |
| **12** | `73456712, Rosa, Flores Soto, 88, Insuficiencia Renal, med-saturado-005, 912345678` *(Médico > 500 pacientes)* | 61, 67, 73, 79, 86, 90, 95 | - *(Alerta RNF-20)* | Llenar formulario -> Registrar Paciente | Paciente registrado exitosamente (PAC-0003).<br>Advertencia: Médico tratante supera límite de 500 pacientes. |

---

## 11.4. Módulo 03: CRUD de Catálogo de Métricas y Umbrales Biométricos (`CU-03`)

### 11.4.1. Clases de Equivalencia

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **Código de Métrica** | **126.** Formato estricto `MET-` seguido de 4 dígitos numéricos (ej. `MET-0001`, `MET-0007`) | **127.** Formato sin prefijo `MET-`<br>**128.** Cantidad de dígitos distinta de 4 (ej. `MET-01`, `MET-00001`)<br>**129.** Caracteres alfanuméricos mezclados (ej. `MET-ABCD`)<br>**130.** Vacío o nulo |
| **Nombre de la Métrica** | **131.** Cadena alfabética descriptiva de 3 a 50 caracteres (ej. `Temperatura Corporal`, `Frecuencia Cardíaca`) | **132.** Menor a 3 caracteres<br>**133.** Mayor a 50 caracteres<br>**134.** Caracteres especiales no permitidos<br>**135.** Vacío o nulo |
| **Unidad de Medida** | **136.** Cadena clínica representativa de 1 a 15 caracteres (ej. `°C`, `bpm`, `mmHg`, `mg/dL`, `%`) | **137.** Mayor a 15 caracteres<br>**138.** Símbolos no representativos<br>**139.** Vacío o nulo |
| **Rango Mínimo (`rangoMin`)** | **140.** Valor numérico positivo mayor o igual a 0.0 y estrictamente menor que `rangoMax` | **141.** Valor negativo (< 0.0)<br>**142.** Valor mayor o igual a `rangoMax` (Incoherencia RNF-11)<br>**143.** No numérico (texto o símbolos)<br>**144.** Vacío o nulo |
| **Rango Máximo (`rangoMax`)** | **145.** Valor numérico estrictamente mayor que `rangoMin` y menor a 1000.0 | **146.** Valor menor o igual a `rangoMin`<br>**147.** Valor negativo (< 0.0)<br>**148.** Mayor a 1000.0 (fuera de escala biológica)<br>**149.** Vacío o nulo |

---

### 11.4.2. Valores Límite
Se evalúan exactamente las mismas entradas del catálogo, analizando límites de formato y restricciones matemáticas.

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **Código de Métrica** | **150.** Longitud 8 caracteres (prefijo `MET-` + 4 dígitos) | **151.** Longitud 7 caracteres (`MET-001`)<br>**152.** Longitud 9 caracteres (`MET-00001`) |
| **Nombre de la Métrica** | **153.** Longitud 3 caracteres (límite inferior)<br>**154.** Longitud 50 caracteres (límite superior) | **155.** Longitud 2 caracteres<br>**156.** Longitud 51 caracteres |
| **Unidad de Medida** | **157.** Longitud 1 carácter (ej. `%`)<br>**158.** Longitud 15 caracteres (límite superior) | **159.** Longitud 0 (Vacío)<br>**160.** Longitud 16 caracteres |
| **Rango Mínimo (`rangoMin`)** | **161.** `0.0` (mínimo absoluto permitido)<br>**162.** `rangoMax - 0.1` (máximo permitido para Min) | **163.** `-0.1` (negativo no permitido)<br>**164.** Igual a `rangoMax` (`Min == Max`)<br>**165.** Mayor a `rangoMax` (`Min > Max`) |
| **Rango Máximo (`rangoMax`)** | **166.** `rangoMin + 0.1` (mínimo permitido para Max)<br>**167.** `999.9` (límite superior fisiológico) | **168.** `1000.0` (excede escala biológica)<br>**169.** Igual a `rangoMin` |

---

### 11.4.3. Casos de Prueba Unitarias por Campo

#### Casos de Prueba Unitaria: Código de Métrica
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `MET-0001` | 126, 150 | - | • Ingresar código<br>• Pasar a siguiente campo | Código Aceptado |
| `MET-001` (3 dígitos) | - | 128, 151 | • Ingresar código de 3 dígitos<br>• Siguiente | Error: Código debe tener formato MET-XXXX (4 dígitos) |
| `MET-00001` (5 dígitos) | - | 128, 152 | • Ingresar código de 5 dígitos<br>• Siguiente | Error: Longitud de código excedida |
| `TEMP-0001` | - | 127 | • Ingresar prefijo distinto<br>• Siguiente | Error: Código debe iniciar con 'MET-' |
| `[Vacío]` | - | 130 | • Dejar en blanco<br>• Siguiente | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Nombre y Unidad
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Temperatura Corporal` | 131 | - | • Ingresar nombre<br>• Siguiente campo | Nombre Aceptado |
| `SpO2` | 131 | - | • Ingresar nombre corto<br>• Siguiente campo | Nombre Aceptado |
| `FC` (2 caracteres) | - | 132, 155 | • Ingresar 2 caracteres<br>• Siguiente campo | Error: Nombre debe tener entre 3 y 50 caracteres |
| `[Vacío]` | - | 135 | • Dejar en blanco<br>• Siguiente campo | Error: Campo obligatorio |
| `°C` | 136 | - | • Ingresar unidad clínica<br>• Siguiente campo | Unidad Aceptada |
| `%` (1 carácter) | 136, 157 | - | • Ingresar 1 carácter<br>• Siguiente campo | Unidad Aceptada |
| `[Vacío]` | - | 139, 159 | • Dejar unidad en blanco<br>• Siguiente campo | Error: Campo obligatorio |

#### Casos de Prueba Unitaria: Coherencia de Rangos (`rangoMin` vs `rangoMax`)
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Min: 36.0, Max: 37.5` | 140, 145 | - | • Digitar Min y Max<br>• Validar coherencia | Umbrales Aceptados |
| `Min: 0.0, Max: 100.0` | 140, 145, 161 | - | • Digitar Min = 0.0<br>• Validar | Umbrales Aceptados (Límite cero permitido) |
| `Min: 37.5, Max: 37.5` | - | 142, 146, 164, 169 | • Digitar valores iguales<br>• Validar | Error: Rango mínimo no puede ser igual al máximo |
| `Min: 39.0, Max: 36.0` | - | 142, 146, 165 | • Digitar Min superior a Max<br>• Validar | Error RNF-11: Rango mínimo no puede ser mayor al máximo |
| `Min: -5.0, Max: 40.0` | - | 141, 163 | • Digitar Min negativo<br>• Validar | Error: No se admiten valores negativos |
| `Min: 60.0, Max: 1200.0` | 140 | 148, 168 | • Digitar Max fuera de escala<br>• Validar | Error: Rango máximo excede escala fisiológica (máx. 1000.0) |

---

### 11.4.2. Casos de Prueba de Integración: CRUD de Métricas y Umbrales

| ID | Casos de Prueba de Integración (Entrada CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **13** | `MET-0007, Temperatura Corporal, °C, 36.0, 37.5` | 126, 131, 136, 140, 145, 150 | - | Llenar formulario -> Guardar Métrica | Métrica creada exitosamente.<br>Umbrales configurados: 36.0 - 37.5 °C. |
| **14** | `MET-0002, Frecuencia Cardíaca, bpm, 60.0, 100.0` | 126, 131, 136, 140, 145, 150 | - | Llenar formulario -> Guardar Métrica | Métrica creada exitosamente.<br>Umbrales configurados: 60.0 - 100.0 bpm. |
| **15** | `MET-0003, Saturación de Oxígeno, %, 95.0, 100.0` | 126, 131, 136, 140, 145, 150 | - | Llenar formulario -> Guardar Métrica | Métrica creada exitosamente.<br>Umbrales configurados: 95.0 - 100.0 %. |
| **16** | `MET-002, FC, bpm, 100.0, 60.0` | 136 | 128, 132, 142, 146, 151, 155, 165 | Llenar formulario -> Guardar Métrica | Error: Código debe tener 4 dígitos.<br>Error: Nombre muy corto.<br>Error: Mínimo no puede ser mayor que Máximo. |
| **17** | `MET-0007, Temperatura Cutánea, °C, 35.5, 37.0` *(Código repetido)* | 131, 136, 140, 145 | 126 *(Colisión)* | Llenar formulario -> Guardar Métrica | Error: El código de métrica MET-0007 ya está en uso. |
| **18** | `MET-0008, Temperatura Corporal, Grados, 35.0, 38.0` *(Nombre repetido)* | 126, 136, 140, 145 | 131 *(Colisión RNF-49)* | Llenar formulario -> Guardar Métrica | Error: Ya existe una métrica con el nombre ingresado. |

---

## 11.5. Módulo 04: CRUD de Ingesta de Telemetría IoT y Gestión de Alertas Críticas (`CU-08` / `CU-09` / `CU-07`)

### 11.5.1. Clases de Equivalencia

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **ID Paciente** | **170.** UUID v4 registrado de paciente activo en PADOMI | **171.** Formato UUID inválido<br>**172.** Paciente dado de alta o inactivo<br>**173.** Paciente inexistente en BD<br>**174.** Vacío o nulo |
| **ID Métrica** | **175.** UUID v4 registrado de métrica clínica activa en catálogo | **176.** Formato UUID inválido<br>**177.** Métrica inexistente o dada de baja<br>**178.** Vacío o nulo |
| **Valor Biométrico Censado** | **179.** Valor dentro de umbrales normales: `Min <= Valor <= Max` *(Normal / Verde)*<br>**180.** Desvío leve fuera de rango: `Min - 10% <= Valor < Min` o `Max < Valor <= Max + 10%` *(Advertencia / Amarillo)*<br>**181.** Desvío severo: `Valor < Min - 10%` o `Valor > Max + 10%` *(Crítico / Rojo)* | **182.** Valor negativo no biológico (< 0.0)<br>**183.** Valor extremadamente corrupto o fuera de escala (> 1000.0)<br>**184.** No numérico (cadena de texto, boolean o array)<br>**185.** Nulo o indefinido |
| **Timestamp (Fecha/Hora)** | **186.** Fecha/hora en formato estándar ISO 8601 UTC no futura | **187.** Formato de fecha inválido<br>**188.** Fecha futura en el tiempo<br>**189.** Vacío o nulo |
| **Tamaño de Carga JSON** | **190.** Paquete HTTP JSON con tamaño total menor o igual a 2 MB (RNF-24) | **191.** Paquete JSON superior a 2 MB<br>**192.** Sintaxis corrupta o malformada (no parseable) |
| **Acción de Atención de Alerta** | **193.** Médico tratante autenticado ejecuta clic "Marcar como Atendido" (`atendida: true`) | **194.** Intento de atención por usuario no médico (rol ADMIN)<br>**195.** Segundo clic concurrente sobre alerta ya resuelta (Colisión RNF-06 / RNF-52) |

---

### 11.5.2. Valores Límite
Se evalúan exactamente las mismas entradas del circuito telemétrico, analizando fronteras clínicas para **Temperatura Corporal (`rangoMin: 36.0°C`, `rangoMax: 37.5°C`)**.

| Entrada | Clases Válidas | Clases Inválidas |
| :--- | :--- | :--- |
| **ID Paciente** | **196.** (170) 1 UUID de paciente activo | **197.** (174) 0 identificadores (vacío) |
| **ID Métrica** | **198.** (175) 1 UUID de métrica activa | **199.** (178) 0 identificadores (vacío) |
| **Valor Biométrico Censado** | **200.** `36.0` (frontera inferior Normal - Verde)<br>**201.** `37.5` (frontera superior Normal - Verde)<br>**202.** `35.5` a `35.9` (frontera Advertencia inferior - Amarillo)<br>**203.** `37.6` a `38.5` (frontera Advertencia superior - Amarillo)<br>**204.** `<= 35.4` (Hipotermia Crítica - Rojo)<br>**205.** `>= 38.6` (Hiperpirexia Crítica - Rojo) | **206.** `29.9` (sensor desconectado / artefacto)<br>**207.** `45.1` (no fisiológico)<br>**208.** `-0.1` (negativo no biológico) |
| **Timestamp (Fecha/Hora)** | **209.** Hora actual exacta del servidor (UTC) | **210.** Hora actual + 1 segundo (fecha futura) |
| **Tamaño de Carga JSON** | **211.** Tamaño 2.0 Megabytes (límite superior permitido) | **212.** Tamaño 2.1 Megabytes (excede límite RNF-24) |
| **Acción de Atención de Alerta** | **213.** 1er clic afirmativo en ventana de atención | **214.** 2do clic simultáneo recibido en backend (mismo milisegundo) |

---

### 11.5.3. Casos de Prueba Unitarias por Campo

#### Casos de Prueba Unitaria: Clasificación Biometría (Temperatura Pattern)
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `36.8` | 179 | - | • Evaluar lectura en motor de reglas | Estado: **Normal (Color Verde)** |
| `36.0` (Límite inferior) | 179, 200 | - | • Evaluar lectura en límite inferior | Estado: **Normal (Color Verde)** |
| `37.5` (Límite superior) | 179, 201 | - | • Evaluar lectura en límite superior | Estado: **Normal (Color Verde)** |
| `37.8` (Fiebre leve) | 180, 203 | - | • Evaluar lectura con desvío leve | Estado: **Advertencia (Color Amarillo)** |
| `39.4` (Fiebre alta) | 181, 205 | - | • Evaluar lectura con desvío severo | Estado: **Crítico (Color Rojo)** |
| `34.8` (Hipotermia) | 181, 204 | - | • Evaluar lectura inferior crítica | Estado: **Crítico (Color Rojo)** |
| `-5.0` | - | 182, 208 | • Evaluar valor negativo | Error: Valor fuera de rango biológico |
| `"treinta y siete"` | - | 184 | • Evaluar texto en campo numérico | Error: Sólo se permiten números |

#### Casos de Prueba Unitaria: Concurrencia y Atención de Alertas
| Entrada (CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :--- | :---: | :---: | :--- | :--- |
| `Alerta: alt-01, Médico: med-01, Clic: Atender` | 193, 213 | - | • Médico hace clic en "Marcar como Atendido" | Alerta Silenciada (Estado: Atendida) |
| `Alerta: alt-01, Médico: med-02, Clic: Atender` *(2do clic)* | - | 195, 214 | • Segundo médico hace clic simultáneo | Error: Alerta ya fue gestionada por otro profesional |
| `Alerta: alt-01, Usuario: usr-admin, Clic: Atender` | - | 194 | • Administrador intenta atender alerta | Error: Sólo personal médico puede atender alertas |

---

### 11.5.4. Casos de Prueba de Integración: Ingesta IoT, Triaje y Alertas Críticas

| ID | Casos de Prueba de Integración (Entrada CP) | C. Válida | C. Inválidas | Acciones | Salida |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **19** | `pac-uuid-001, met-uuid-temp, 36.6, 2026-10-10T14:30:00Z, 512 KB, [Lectura]` | 170, 175, 179, 186, 190, 196, 198 | - | Dispositivo IoT emite lectura -> Servidor | Lectura registrada exitosamente.<br>Estado: Normal (Color Verde). Sin alerta. |
| **20** | `pac-uuid-001, met-uuid-temp, 37.9, 2026-10-10T14:35:00Z, 512 KB, [Lectura]` | 170, 175, 180, 186, 190, 196, 198, 203 | - | Dispositivo IoT emite lectura -> Servidor | Lectura registrada exitosamente.<br>Estado: Advertencia (Color Amarillo). Notificación preventiva. |
| **21** | `pac-uuid-001, met-uuid-temp, 39.4, 2026-10-10T14:40:00Z, 512 KB, [Lectura]` | 170, 175, 181, 186, 190, 196, 198, 205 | - | Dispositivo IoT emite lectura -> Servidor | Alerta Crítica generada exitosamente.<br>Estado: Crítico (Color Rojo). Alerta visual en Dashboard. |
| **22** | `pac-uuid-inactivo, met-uuid-temp, 38.0, 2026-10-10T14:42:00Z, 512 KB, [Lectura]` | 175, 180, 186, 190 | 172 | Dispositivo envía datos de paciente inactivo | Error: El paciente se encuentra inactivo o dado de alta. Paquete descartado. |
| **23** | `pac-uuid-001, met-uuid-temp, 1500.0, 2026-10-10T14:45:00Z, 512 KB, [Lectura]` | 170, 175, 186, 190 | 183, 207 | Dispositivo averiado envía valor errático | Error: Valor censado fuera de escala biológica. Lectura descartada. |
| **24** | `pac-uuid-001, met-uuid-temp, 37.0, 2026-10-10T14:50:00Z, 2.5 MB, [Lectura]` | 170, 175, 179, 186 | 191, 212 | Dispositivo envía paquete sobredimensionado | Error: El paquete excede el límite máximo de 2 MB (RNF-24). |

---

## 11.6. Matriz Consolidada de Pruebas y Plan de Ejecución para la Semana 10

Con la estandarización simétrica entre Clases de Equivalencia y Valores Límite, se consolida la siguiente cobertura metodológica que servirá como base directa para la ejecución, recolección de evidencias y depuración de la **Semana 10**:

| Módulo CRUD | Clases de Equivalencia Diseñadas | Valores Límite Identificados | Casos Unitarios por Campo | Casos de Integración Diseñados | Total Escenarios de Calidad |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **CRUD 1: Personal y Usuarios (`CU-02`)** | 37 clases (1 a 37) | 23 límites (38 a 60) | 27 pruebas | 6 integraciones (1 a 6) | **33 escenarios** |
| **CRUD 2: Pacientes Crónicos (`CU-04`)** | 38 clases (61 a 100) | 25 límites (101 a 125) | 21 pruebas | 6 integraciones (7 a 12) | **27 escenarios** |
| **CRUD 3: Métricas y Umbrales (`CU-03`)** | 24 clases (126 a 149) | 24 límites (150 a 169) | 17 pruebas | 6 integraciones (13 a 18) | **23 escenarios** |
| **CRUD 4: Telemetría e Ingesta IoT (`CU-08`)** | 24 clases (170 a 195) | 19 límites (196 a 214) | 11 pruebas | 6 integraciones (19 a 24) | **17 escenarios** |
| **TOTAL CONSOLIDADO** | **123 Clases** | **91 Límites** | **76 Casos Unitarios** | **24 Casos de Integración** | **100 Escenarios de Prueba** |

---

## 11.7. Conclusiones y Observaciones del Equipo (Semana 09)

1. **Correspondencia Estructural Simétrica:** Al alinear exactamente las filas de **Clases de Equivalencia** con las de **Valores Límite** en cada módulo, se garantizó que ningún campo del modelo de datos quede sin análisis de frontera, logrando un diseño robusto y auditable para el docente.
2. **Detección Anticipada de Vulnerabilidades:** El análisis de valores límite permitió blindar tanto los límites sintácticos (longitud exacta de 8 dígitos en DNI, longitud de contraseñas de 8 a 30 caracteres, teléfonos móviles de 9 dígitos) como los límites algorítmicos y clínicos (`rangoMin < rangoMax`, umbrales de alerta en temperatura, y control de sobrecarga médica de 500 pacientes).
3. **Base Sólida para la Semana 10:** Con 24 pruebas de integración y 76 pruebas unitarias formalmente identificadas, el equipo cuenta con una matriz ejecutable que facilitará registrar el resultado (éxito o fallo), documentar la depuración requerida y consolidar el informe final al 100%.

---

## 11.8. Trabajo en Equipo y Asignación de Roles (Semana 09)

En cumplimiento de las pautas de trabajo colaborativo para la **Actividad N°9**, los integrantes del equipo asumieron responsabilidades específicas:

| Integrante | Rol Asignado | Responsabilidad y Aporte en la Semana 09 |
| :--- | :--- | :--- |
| **Jesus Jeanfranco Medina Cabello** | **Tester QA (Responsable Principal)** | Lideró el diseño metodológico de pruebas de caja negra, garantizando la correspondencia exacta entre las 123 clases de equivalencia y los 91 valores límite para los 4 CRUDs del sistema. |
| **Angelo Zair Zavala Matute** | **Desarrollador Backend** | Mapeó las restricciones de persistencia en PostgreSQL (longitudes VARCHAR, restricciones UNIQUE y checks de rango) con las salidas esperadas en los casos de prueba de integración. |
| **Nicole Darlene Tito Huacho** | **Desarrollador Frontend** | Validó los estados visuales en los formularios de React (alerta roja, naranja y verde) y las máscaras de entrada para campos como DNI y Teléfono, asegurando concordancia con el diseño de pruebas. |
| **Franco Emerson Gonzalez Poma** | **Líder de Proyecto** | Supervisó la completitud de las matrices en todos los CRUDs, coordinó la alineación con los requerimientos funcionales del sistema (RF-01 al RF-18) y consolidó el documento formal de la Semana 09. |
