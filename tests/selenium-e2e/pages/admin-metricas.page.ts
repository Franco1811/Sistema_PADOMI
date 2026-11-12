import { By, Key, until, WebDriver } from 'selenium-webdriver';
import { SELENIUM_CONFIG, pausaVisual } from '../config/selenium.config';

/**
 * Page Object Model (POM): Módulo CORE Catálogo de Métricas Clínicas (CU-03)
 * Evalúa:
 *  1. Regla de frontera matemática RNF-11 en UI (Bloqueo cuando rangoMin >= rangoMax).
 *  2. Registro de métrica clínica válida y persistencia en tabla del catálogo.
 */
export class AdminMetricasPage {
  private readonly tabMetricasBtn = By.xpath("//button[contains(., 'Catálogo de Métricas')]");
  private readonly agregarMetricaBtn = By.xpath("//button[contains(., 'Agregar Métrica')]");
  private readonly modalTitulo = By.xpath("//h2[contains(., 'Agregar Nueva Métrica Clínica')]");

  private readonly nombreInput = By.css("input[name='nombre']");
  private readonly unidadInput = By.css("input[name='unidad']");
  private readonly rangoMinInput = By.css("input[name='rangoMin']");
  private readonly rangoMaxInput = By.css("input[name='rangoMax']");
  private readonly descripcionTextarea = By.css("textarea[name='descripcion']");
  private readonly submitModalBtn = By.css('button.btn-submit');

  private readonly errorModalBanner = By.css('.error-message');
  private readonly logoutBtn = By.css('button.btn-logout');

  constructor(private readonly driver: WebDriver) {}

  async abrirCatalogoMetricas(): Promise<void> {
    const tab = await this.driver.wait(
      until.elementLocated(this.tabMetricasBtn),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await tab.click();
    await pausaVisual();
  }

  async abrirModalNuevaMetrica(): Promise<void> {
    const btn = await this.driver.wait(
      until.elementLocated(this.agregarMetricaBtn),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await btn.click();
    await this.driver.wait(
      until.elementLocated(this.modalTitulo),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await pausaVisual();
  }

  async llenarFormularioMetrica(datos: {
    nombre: string;
    unidad: string;
    rangoMin: string;
    rangoMax: string;
    descripcion: string;
  }): Promise<void> {
    const nombreEl = await this.driver.findElement(this.nombreInput);
    await nombreEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, datos.nombre);

    const unidadEl = await this.driver.findElement(this.unidadInput);
    await unidadEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, datos.unidad);

    const minEl = await this.driver.findElement(this.rangoMinInput);
    await minEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, datos.rangoMin);

    const maxEl = await this.driver.findElement(this.rangoMaxInput);
    await maxEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, datos.rangoMax);

    const descEl = await this.driver.findElement(this.descripcionTextarea);
    await descEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, datos.descripcion);

    await pausaVisual();
  }

  async enviarFormulario(): Promise<void> {
    const submit = await this.driver.findElement(this.submitModalBtn);
    await submit.click();
  }

  async obtenerMensajeErrorUmbralInvertido(): Promise<string> {
    const errorEl = await this.driver.wait(
      until.elementLocated(this.errorModalBanner),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await pausaVisual(SELENIUM_CONFIG.MODAL_OBSERVE_MS);
    return await errorEl.getText();
  }

  async corregirRangosYGuardar(
    rangoMinValido: string,
    rangoMaxValido: string,
    nombreMetricaEsperada: string
  ): Promise<boolean> {
    const minEl = await this.driver.findElement(this.rangoMinInput);
    await minEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, rangoMinValido);

    const maxEl = await this.driver.findElement(this.rangoMaxInput);
    await maxEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, rangoMaxValido);
    await pausaVisual();

    await this.enviarFormulario();

    // Esperamos directamente a que la nueva métrica aparezca renderizada en la tabla del catálogo
    const fila = await this.driver.wait(
      until.elementLocated(By.xpath(`//table//td[contains(., '${nombreMetricaEsperada}')]`)),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await pausaVisual(SELENIUM_CONFIG.MODAL_OBSERVE_MS);
    return await fila.isDisplayed();
  }

  async cerrarSesion(): Promise<void> {
    const btn = await this.driver.wait(
      until.elementLocated(this.logoutBtn),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await btn.click();
    await pausaVisual();
  }
}
