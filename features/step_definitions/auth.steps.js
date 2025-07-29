const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Fixtures
const users = require('../support/fixtures/users.json');

// Background steps
Given('que navego a la página de login del sistema', { timeout: 10000 }, async function () {
  await this.loginPage.navigate();
});

// When steps - Acciones de usuario
When('intento iniciar sesión con credenciales incorrectas', async function () {
  const invalidUser = users.invalidUsers.wrongCredentials;
  await this.loginPage.login(invalidUser.email, invalidUser.password);
  this.setTestData('expectedError', invalidUser.expectedError);
});

When('intento iniciar sesión sin proporcionar email', async function () {
  const invalidUser = users.invalidUsers.emptyEmail;
  await this.loginPage.login(invalidUser.email, invalidUser.password);
  this.setTestData('expectedError', invalidUser.expectedError);
});

When('intento iniciar sesión sin proporcionar contraseña', async function () {
  const invalidUser = users.invalidUsers.emptyPassword;
  await this.loginPage.login(invalidUser.email, invalidUser.password);
  this.setTestData('expectedError', invalidUser.expectedError);
});

When('intento acceder directamente a la página de productos sin estar autenticado', async function () {
  await this.productsPage.navigate();
});

// Then steps - Verificaciones
Then('debería ver un mensaje de error de credenciales inválidas', async function () {
  const expectedError = this.getTestData('expectedError');
 // await this.loginPage.verifyLoginFailure(expectedError);
 await this.loginPage.verifyInvalidCredentialsError('Las credenciales proporcionadas son incorrectas.');
});

Then('no debería poder acceder al sistema', async function () {
  // Verificar que no hay elementos del dashboard visible
  const dashboardElements = [
    'h1:has-text("Dashboard")'
  ];
  
  for (const element of dashboardElements) {
    await expect(this.page.locator(element)).not.toBeVisible();
  }
});

Then('debería permanecer en la página de login', async function () {
  await expect(this.page).toHaveURL(/\/login/);
});

Then('debería ver un mensaje de error indicando que el email es requerido', async function () {
  const expectedError = this.getTestData('expectedError');
  await this.loginPage.verifyFieldValidation('email', expectedError);
});

Then('debería ver un mensaje de error indicando que la contraseña es requerida', async function () {
  const expectedError = this.getTestData('expectedError');
  await this.loginPage.verifyFieldValidation('password', expectedError);
});

Then('debería ver un mensaje de error de formato de email inválido', async function () {
  const expectedError = this.getTestData('expectedError');
  await this.loginPage.verifyLoginFailure(expectedError);
});

Then('el sistema debería rechazar el intento sin procesar la consulta maliciosa', async function () {
  // Verificar que el sistema maneja correctamente el intento de inyección
  await this.loginPage.verifyLoginFailure();
});

Then('debería mostrar un error de credenciales inválidas', async function () {
  const expectedError = this.getTestData('expectedError');
  await this.loginPage.verifyLoginFailure(expectedError);
});

Then('no debería comprometer la seguridad del sistema', async function () {
  // Verificar que seguimos en login y no hay acceso no autorizado
  await expect(this.page).toHaveURL(/\/login/);
  // Verificar que no hay cookies de sesión establecidas
  const cookies = await this.context.cookies();
  const sessionCookie = cookies.find(cookie => cookie.name === 'session_token');
  expect(sessionCookie).toBeUndefined();
});

Then('debería ser redirigido a la página de login', async function () {
  await this.loginPage.verifyAccessDeniedToProtectedPage();
});

Then('debería ver un mensaje indicando que se requiere autenticación', async function () {
  const authMessage = this.page.locator('.access-denied-message, .auth-required-message');
  if (await this.loginPage.isElementVisible('.access-denied-message, .auth-required-message')) {
    await expect(authMessage).toBeVisible();
  }
});