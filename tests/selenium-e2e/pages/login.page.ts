import { By, Key, until, WebDriver } from 'selenium-webdriver';
import { SELENIUM_CONFIG, pausaVisual } from '../config/selenium.config';

/**
 * Page Object Model (POM): Vista de Autenticación Institucional (CU-01)
 * Actúa como pre-condición de contexto para acceder a los módulos CORE.
 */
export class LoginPage {
  private readonly emailInput = By.css('#login-email');
  private readonly passwordInput = By.css('#login-pass');
  private readonly submitButton = By.css('button.login-btn-submit');

  constructor(private readonly driver: WebDriver) {}

  async navegar(): Promise<void> {
    await this.driver.get(SELENIUM_CONFIG.FRONTEND_URL);
    await this.driver.wait(
      until.elementLocated(this.emailInput),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
  }

  async iniciarSesion(email: string, password: string): Promise<void> {
    const emailEl = await this.driver.wait(
      until.elementLocated(this.emailInput),
      SELENIUM_CONFIG.TIMEOUT_EXPLICITO_MS
    );
    await emailEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, email);
    await pausaVisual(400);

    const passEl = await this.driver.findElement(this.passwordInput);
    await passEl.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE, password);
    await pausaVisual(400);

    const btn = await this.driver.findElement(this.submitButton);
    await btn.click();
    await pausaVisual();
  }
}

