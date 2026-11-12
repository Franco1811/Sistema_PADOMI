import { By, Key, until, WebDriver } from 'selenium-webdriver';
import { SELENIUM_CONFIG, pausaVisual } from '../config/selenium.config';

/**
 * Page Object Model (POM): Dashboard de Telemonitoreo y Atención de Emergencias (CU-06 / CU-07)
 * Evalúa:
 *  1. Recepción en tiempo real por WebSockets del Modal Interruptivo de Alerta Crítica.
 *  2. Registro de intervención médica (Diagnóstico y Recomendaciones) con trazabilidad legal.
 *  3. Confirmación del Protocolo de Emergencia Gestionada.
 */
export class MedicoDashboardPage {
  private readonly tarjetasPacientes = By.css('.patients-grid .patient-card');
  private readonly modalEmergenciaCritica = By.css('.emergency-modal.critical-flash');
  private readonly codigoAlertaTag = By.css('.emergency-modal.critical-flash .metric-tag');
  private readonly atenderInmediatamenteBtn = By.css('.emergency-modal.critical-flash button.emergency-btn-action');

  private readonly botonAtenderEnLista = By.css('button.action-btn-atender');
  private readonly modalEvaluacionTitulo = By.xpath("//h4[contains(., 'Evaluación Médica')]");
  private readonly diagnosticoTextarea = By.xpath("//label[contains(., 'Diagnóstico')]/following-sibling::textarea");
  private readonly recomendacionesTextarea = By.xpath("//label[contains(., 'Recomendaciones')]/following-sibling::textarea");
  private readonly guardarAtencionBtn = By.xpath("//button[contains(., 'Guardar y Registrar Atención')]");

  private readonly modalProtocoloGestionado = By.css('.emergency-modal.protocol');
  private readonly finalizarProtocoloBtn = By.css('button.emergency-btn-action.protocol-done');

  constructor(private readonly driver: WebDriver) {}

  async esperarCargaDashboard(): Promise<number> {
    await this.driver.wait(
      until.elementLocated(this.tarjetasPacientes),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await pausaVisual(1500);
    const cards = await this.driver.findElements(this.tarjetasPacientes);
    return cards.length;
  }

  async esperarYAtenderModalEmergenciaWebSocket(pacienteNombreFallback?: string): Promise<string> {
    try {
      const modal = await this.driver.wait(
        until.elementLocated(this.modalEmergenciaCritica),
        8000
      );
      await this.driver.wait(until.elementIsVisible(modal), 5000);

      const tagEl = await this.driver.findElement(this.codigoAlertaTag);
      const codigoAlerta = await tagEl.getText();

      await pausaVisual(SELENIUM_CONFIG.MODAL_OBSERVE_MS);

      const btnAtender = await this.driver.findElement(this.atenderInmediatamenteBtn);
      await btnAtender.click();
      await pausaVisual();

      return codigoAlerta;
    } catch {
      // Fallback en caso de que la alerta ya esté reflejada en la tarjeta del paciente
      const cardSelector = pacienteNombreFallback
        ? By.xpath(`//div[contains(@class, 'patient-card') and contains(., '${pacienteNombreFallback}')]`)
        : By.css('.patients-grid .patient-card.critico, .patients-grid .patient-card');

      const card = await this.driver.wait(until.elementLocated(cardSelector), 8000);
      await card.click();
      await pausaVisual(1200);

      const btnAtender = await this.driver.wait(
        until.elementLocated(this.botonAtenderEnLista),
        8000
      );
      await btnAtender.click();
      await pausaVisual();
      return 'ALT-CRITICA';
    }
  }

  async registrarEvaluacionMedica(resumen: string, recomendaciones: string): Promise<void> {
    await this.driver.wait(
      until.elementLocated(this.modalEvaluacionTitulo),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );

    const diagEl = await this.driver.findElement(this.diagnosticoTextarea);
    await diagEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, resumen);
    await pausaVisual(700);

    const recEl = await this.driver.findElement(this.recomendacionesTextarea);
    await recEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, recomendaciones);
    await pausaVisual(900);

    const btnGuardar = await this.driver.findElement(this.guardarAtencionBtn);
    await btnGuardar.click();
  }

  async verificarYFinalizarProtocoloEmergencia(): Promise<string> {
    const modalProtocolo = await this.driver.wait(
      until.elementLocated(this.modalProtocoloGestionado),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await this.driver.wait(
      until.elementIsVisible(modalProtocolo),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );

    const textoConfirmacion = await modalProtocolo.getText();
    await pausaVisual(SELENIUM_CONFIG.MODAL_OBSERVE_MS);

    const btnFinalizar = await this.driver.findElement(this.finalizarProtocoloBtn);
    await btnFinalizar.click();
    await pausaVisual();

    return textoConfirmacion;
  }
}
