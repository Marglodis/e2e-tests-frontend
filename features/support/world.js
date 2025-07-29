const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const LoginPage = require('./pages/LoginPage');
const ProductsPage = require('./pages/ProductsPage');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.loginPage = null;
    this.productsPage = null;
    this.testData = {};
  }

  async init() {
    // Configurar browser
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 100 // Ralentizar acciones para mejor visualización
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true
    });
    
    this.page = await this.context.newPage();
    
    // Inicializar páginas
    this.loginPage = new LoginPage(this.page);
    this.productsPage = new ProductsPage(this.page);
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  // Métodos auxiliares
  setTestData(key, value) {
    this.testData[key] = value;
  }

  getTestData(key) {
    return this.testData[key];
  }
}

setWorldConstructor(CustomWorld);
module.exports = CustomWorld;