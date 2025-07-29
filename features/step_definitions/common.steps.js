const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Steps comunes para todos los features

// Given steps - Precondiciones
Given('que soy un usuario registrado en el sistema', async function () {
  // Esta es una precondición que se asume verdadera
  this.setTestData('userType', 'registered');
});

Given('que he iniciado sesión correctamente', { timeout: 15000 }, async function () {
  await this.loginPage.navigate();
  await this.loginPage.loginWithValidUser();
  await this.loginPage.verifyLoginSuccess();
});

Given('que navego a la página de productos', async function () {
  await this.productsPage.navigate();
  await this.productsPage.verifyPageLoaded();
});

Given('que existe un producto llamado {string} en el sistema', async function (productName) {
  // Buscar el producto, si no existe, crearlo
  try {
    await this.productsPage.verifyProductInTable(productName);
    this.setTestData('productExists', true);
  } catch (error) {
    // El producto no existe, necesitamos crearlo
    const products = require('../support/fixtures/products.json');
    let productData;
    
    if (productName === 'SKU-1') {
      productData = products.iphone16;
    } else if (productName === 'iPhone 16 Pro Max') {
      productData = products.iphone16ProMax;
    } else {
      // Crear producto genérico
      productData = {
        name: productName,
        description: `Descripción de ${productName}`,
        price: '999.99',
        category: 'Smartphones',
        stock: '10'
      };
    }
    
    await this.productsPage.createProduct(productData);
    await this.productsPage.verifySuccessMessage();
    this.setTestData('productExists', true);
  }
});

Given('que existen productos en el sistema', async function () {
  // Verificar que hay al menos un producto
  const productCount = await this.productsPage.getProductCount();
  if (productCount === 0) {
    // Crear un producto de ejemplo
    const products = require('../support/fixtures/products.json');
    await this.productsPage.createProduct(products.iphone16); 
    await this.productsPage.verifySuccessMessage();
  }
  this.setTestData('productsExist', true);
});

Given('que el sistema tiene una gran cantidad de productos', async function () {
  // Para este escenario, asumimos que hay muchos productos
  // En un entorno real, esto podría configurarse con datos de prueba específicos
  this.setTestData('manyProducts', true);
});

Given('que el servidor presenta problemas temporales', async function () {
  // Simular problemas del servidor interceptando requests
  await this.page.route('**/api/articulos/**', route => {
    if (route.request().method() === 'DELETE') {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Error interno del servidor' })
      });
    } else {
      route.continue();
    }
  });
  this.setTestData('serverError', true);
});



Then('debería regresar a la lista de productos', async function () {
  await this.productsPage.verifyPageLoaded();
  await expect(this.page.locator('#product-form')).not.toBeVisible();
});