const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectores
    this.emailInput = '#email';
    this.passwordInput = '#password';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = '.error-message';
    this.logoutButton = 'button:has-text("Cerrar Sesión")';
    this.dashboardTitle = 'h1:has-text("Dashboard")';
    this.credentialsErrorMessage = '[id="2"]:has-text("Las credenciales proporcionadas son incorrectas.")';
    //this.credentialsErrorText = `${this.credentialsErrorMessage} > :not(.Toastify__toast-icon):not(.Toastify__close-button):not(.Toastify__progress-bar--wrp)`;
  }

  async navigate() {
    await this.page.goto('https://test-adl.leonardojose.dev/login');
    await this.waitForNetworkIdle();
  }

  async fillCredentials(email, password) {
    if (email !== undefined) {
      await this.page.fill(this.emailInput, email);
    }
    if (password !== undefined) {
      await this.page.fill(this.passwordInput, password);
    }
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  async login(email, password) {
    await this.fillCredentials(email, password);
    await this.clickLogin();
  }

  async loginWithValidUser() {
    const users = require('../fixtures/users.json');
    const validUser = users.validUser;
    await this.login(validUser.email, validUser.password);
  }

  async verifyLoginSuccess() {
    // Esperar a que aparezca el dashboard
    await expect(this.page.locator(this.dashboardTitle)).toBeVisible({ timeout: 10000 });
    // Verificar URL
    await expect(this.page).toHaveURL(/\/dashboard/);
    // Verificar que el botón de logout esté visible
    await expect(this.page.locator(this.logoutButton)).toBeVisible();
  }

  async verifyLoginFailure(expectedErrorMessage = null) {
    await expect(this.page.locator(this.errorMessage)).toBeVisible({ timeout: 5000 });

    if (expectedErrorMessage) {
      await expect(this.page.locator(this.errorMessage)).toContainText(expectedErrorMessage);
    }

    await expect(this.page).toHaveURL(/\/login/);
  }

  async verifyInvalidCredentialsError(expectedMessage = 'Las credenciales proporcionadas son incorrectas.') {
    const errorLocator = this.page.locator(`text="${expectedMessage}"`);
    await expect(errorLocator).toBeVisible({ timeout: 10000 });
    await expect(this.page).toHaveURL(/\/login/);
  }

  async verifyFieldValidation(field, expectedMessage) {
    const fieldSelector = field === 'email' ? this.emailInput : this.passwordInput;
    const validationMessage = `${fieldSelector} + .field-error`;

    await expect(this.page.locator(validationMessage)).toBeVisible();
    if (expectedMessage) {
      await expect(this.page.locator(validationMessage)).toContainText(expectedMessage);
    }
  }

  async verifyAccessDeniedToProtectedPage() {
    // Verificar redirección a login
    await expect(this.page).toHaveURL(/\/login/);

    // Verificar mensaje de acceso denegado
    const accessDeniedMessage = '.access-denied-message';
    if (await this.isElementVisible(accessDeniedMessage)) {
      await expect(this.page.locator(accessDeniedMessage)).toBeVisible();
    }
  }

  async logout() {
    if (await this.isElementVisible(this.logoutButton)) {
      await this.page.click(this.logoutButton);
      await this.waitForNetworkIdle();
    }
  }
}

module.exports = LoginPage;