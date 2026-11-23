import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as assert from 'assert';
import { SELENIUM_CONFIG, pausaVisual } from './config/selenium.config';
import { LoginPage } from './pages/login.page';
import { AdminMetricasPage } from './pages/admin-metricas.page';
import { MedicoDashboardPage } from './pages/medico-dashboard.page';
import { IoTSimulatorHelper } from './services/iot-simulator.helper';

/**
 * ============================================================================
 * SUITE DE AUTOMATIZACIÓN E2E CON SELENIUM WEBDRIVER (PATRÓN PAGE OBJECT MODEL)
 * Proyecto: Sistema de Telemetría y Gestión de Alertas (PADOMI - EsSalud)
 * Trabajo de Campo N° 3 — Franco Emerson Gonzalez Poma
 * ============================================================================
 */
async function ejecutarSuiteSeleniumCore(): Promise<void> {
  console.log('\n================================================================================');
  console.log('  SELENIUM WEBDRIVER E2E - SUITE AUTOMATIZADA DEL CORE CLÍNICO PADOMI (TC3)');
  console.log('  Arquitectura: Page Object Model (POM) | Navegador: Google Chrome');
  console.log('================================================================================\n');

  const options = new chrome.Options();
  options.addArguments('--start-maximized');
  options.addArguments('--disable-notifications');
  options.addArguments('--log-level=3');
  options.addArguments('--silent');
  options.excludeSwitches('enable-logging');

  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');
  }

  let driver: WebDriver | null = null;
  const inicioGlobal = Date.now();

  try {
    console.log('[SETUP] Iniciando instancia de Google Chrome vía Selenium WebDriver 4...');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    const loginPage = new LoginPage(driver);
    const adminMetricasPage = new AdminMetricasPage(driver);
    const medicoDashboardPage = new MedicoDashboardPage(driver);

    // =========================================================================
    // PRUEBA AUTOMATIZADA CORE #01:
    // Parametrización de Catálogo Clínico y Regla de Frontera RNF-11 (CU-03)
    // =========================================================================
    console.log('\n--------------------------------------------------------------------------------');
    console.log('▶ PRUEBA AUTOMATIZADA SELENIUM #01 (CORE CU-03):');
    console.log('  Validación de Frontera Matemática (rangoMin >= rangoMax - RNF-11) y');
    console.log('  Registro Automatizado de Métrica Biométrica en el Catálogo Clínico');
    console.log('--------------------------------------------------------------------------------');
    const t1 = Date.now();

    console.log('  [Paso 1.1] Accediendo al sistema con contexto de Administrador...');
    await loginPage.navegar();
    await loginPage.iniciarSesion(
      SELENIUM_CONFIG.CREDENCIALES.ADMIN.email,
      SELENIUM_CONFIG.CREDENCIALES.ADMIN.password
    );

    console.log('  [Paso 1.2] Navegando al módulo CORE: Catálogo de Métricas Clínicas (CU-03)...');
    await adminMetricasPage.abrirCatalogoMetricas();
    await adminMetricasPage.abrirModalNuevaMetrica();

    const sufijo = Math.floor(100 + Math.random() * 900);
    const nombreMetrica = `Oximetría Capilar Selenium ${sufijo}`;

    console.log('  [Paso 1.3] Inyectando umbral clínico INVERTIDO (Mínimo: 140 >= Máximo: 90)...');
    await adminMetricasPage.llenarFormularioMetrica({
      nombre: nombreMetrica,
      unidad: '% SpO2',
      rangoMin: '140',
      rangoMax: '90',
      descripcion: 'Prueba automatizada Selenium WebDriver validando frontera RNF-11'
    });
    await adminMetricasPage.enviarFormulario();

    const msgError = await adminMetricasPage.obtenerMensajeErrorUmbralInvertido();
    assert.ok(
      msgError.toLowerCase().includes('mayor que el límite mínimo'),
      `Se esperaba bloqueo por RNF-11, pero se obtuvo: ${msgError}`
    );
    console.log(`  ✔ [ASSERT PASS] Bloqueo de frontera RNF-11 verificado en UI: "${msgError}"`);

    console.log('  [Paso 1.4] Corrigiendo umbrales a rango clínico coherente [94.0 - 100.0 %]...');
    const visibleEnTabla = await adminMetricasPage.corregirRangosYGuardar('94', '100', nombreMetrica);
    assert.strictEqual(visibleEnTabla, true, 'La métrica creada debe mostrarse en la tabla del catálogo');
    console.log(`  ✔ [ASSERT PASS] Métrica "${nombreMetrica}" persistida y verificada en la tabla del DOM.`);
    console.log(`  ✅ PRUEBA SELENIUM #01 COMPLETADA CON ÉXITO (${Date.now() - t1} ms)\n`);

    // Cerrar sesión de Administrador para pasar al flujo del Médico Tratante
    await adminMetricasPage.cerrarSesion();

    // =========================================================================
    // PRUEBA AUTOMATIZADA CORE #02:
    // Ciclo Completo de Emergencia Biométrica IoT en Tiempo Real (CU-06/07/08/09)
    // =========================================================================
    console.log('--------------------------------------------------------------------------------');
    console.log('▶ PRUEBA AUTOMATIZADA SELENIUM #02 (CORE CU-06 / CU-07 / CU-08 / CU-09):');
    console.log('  Disparo de Telemetría IoT Crítica en Vivo, Recepción WebSocket y');
    console.log('  Atención Médica de Emergencia con Trazabilidad Legal');
    console.log('--------------------------------------------------------------------------------');
    const t2 = Date.now();

    console.log('  [Paso 2.1] Iniciando sesión como Médico Tratante (Dr. Carlos Mendoza)...');
    await loginPage.iniciarSesion(
      SELENIUM_CONFIG.CREDENCIALES.MEDICO.email,
      SELENIUM_CONFIG.CREDENCIALES.MEDICO.password
    );

    const totalTarjetas = await medicoDashboardPage.esperarCargaDashboard();
    assert.ok(totalTarjetas > 0, 'El Dashboard médico debe mostrar pacientes crónicos asignados');
    console.log(`  ✔ [ASSERT PASS] Dashboard de Telemonitoreo cargado (${totalTarjetas} pacientes en vista).`);

    console.log('  [Paso 2.2] Simulando envío de lectura crítica desde sensor IoT (POST /api/ingesta)...');
    const disparoIoT = await IoTSimulatorHelper.dispararPulsoCriticoEnVivo();
    console.log(
      `  ⚡ [PULSO IOT ENVIADO] Paciente: ${disparoIoT.pacienteNombre} | ` +
      `Métrica: ${disparoIoT.metricaNombre} | Valor Crítico: ${disparoIoT.valorEnviado} (${disparoIoT.lecturaCodigo})`
    );

    console.log('  [Paso 2.3] Esperando Modal Interruptivo de Emergencia vía WebSockets (CU-07)...');
    const codigoAlerta = await medicoDashboardPage.esperarYAtenderModalEmergenciaWebSocket(
      disparoIoT.pacienteNombre
    );
    console.log(`  ✔ [ASSERT PASS] Alerta Crítica (${codigoAlerta}) interceptada en vivo y abierta para triaje.`);

    console.log('  [Paso 2.4] Registrando Evaluación Médica y Tratamiento de Emergencia...');
    await medicoDashboardPage.registrarEvaluacionMedica(
      `[Automatización Selenium E2E] Descompensación aguda detectada por sensor IoT (${disparoIoT.valorEnviado}). Paciente contactado.`,
      'Se indica estabilización domiciliaria inmediata y envío de unidad móvil de urgencia PADOMI.'
    );

    console.log('  [Paso 2.5] Verificando Protocolo Clínico de Emergencia Gestionada...');
    const textoProtocolo = await medicoDashboardPage.verificarYFinalizarProtocoloEmergencia();
    assert.ok(
      textoProtocolo.includes('EMERGENCIA GESTIONADA'),
      'Debe mostrarse el modal de confirmación de Emergencia Gestionada'
    );
    console.log('  ✔ [ASSERT PASS] Emergencia médica auditada en base de datos y protocolo finalizado.');
    console.log(`  ✅ PRUEBA SELENIUM #02 COMPLETADA CON ÉXITO (${Date.now() - t2} ms)\n`);

    await pausaVisual(1500);

    console.log('================================================================================');
    console.log('  RESUMEN DE EJECUCIÓN SELENIUM WEBDRIVER E2E');
    console.log('--------------------------------------------------------------------------------');
    console.log('  ✔ Prueba Core #01 (CU-03 Frontera RNF-11 y Catálogo Clínico) : PASSED');
    console.log('  ✔ Prueba Core #02 (CU-06/07/08/09 Emergencia IoT WebSocket)  : PASSED');
    console.log(`  Total: 2/2 Flujos E2E Core Exitosos | Tiempo Total: ${((Date.now() - inicioGlobal) / 1000).toFixed(2)}s`);
    console.log('================================================================================\n');
  } catch (error) {
    console.error('\n❌ [FALLO EN SUITE SELENIUM E2E]:', error);
    process.exitCode = 1;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

ejecutarSuiteSeleniumCore();
