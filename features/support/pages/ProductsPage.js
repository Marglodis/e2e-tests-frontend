const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores principales
    this.pageTitle = 'h1:has-text("Listado de Artículos")';
    this.entidadesButton = 'span:has-text("Entidades")';
    this.articulosButton = 'a[href="/articulos"]';
    this.productsTable = 'table';
    this.addProductButton = 'button[type="button"]:has-text("Crear Artículo")';
    
    // Selectores del formulario
    this.codigoInput = '#sku';
    this.descriptionInput = '#name';
    this.stockInput = '#stock_quantity';
    this.costoInput = '#cost_price';
    this.saleInput = '#sale_price';
    this.unidadSelect = '#unit'
    this.guardarButton = 'button[type="button"]:has-text("Guardar Cambios")';
    this.cancelarButton = 'button[type="button"]:has-text("Cancelar")';
    
    // Selectores de mensajes
    this.successMessage = '.success-message';
    this.errorMessage = '.error-message';
    this.validationErrors = '.validation-errors';
    
    // Selectores de acciones en tabla
    this.editButton = '.edit-btn';
    this.deleteButton = '.delete-btn';
    this.confirmDeleteModal = '#confirm-delete-modal';
    this.confirmDeleteButton = '#confirm-delete-btn';
    this.cancelDeleteButton = '#cancel-delete-btn';
  }

  async navigate() {
    await this.page.goto('https://test-adl.leonardojose.dev/articulos');
    await this.waitForNetworkIdle();
  }

  async verifyPageLoaded() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();
    await expect(this.page.locator(this.addProductButton)).toBeVisible();
  }

  async verifyProductsTableVisible() {
    await expect(this.page.locator(this.productsTable)).toBeVisible();
  }

  async searchProduct(productName) {
    await this.page.waitForSelector(this.productsTable);
    await this.waitForNetworkIdle();
    this.lastSearchedProduct = productName;
  }

  async verifyProductInTable(productName) {
    await this.searchProduct(productName);
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await expect(productRow).toBeVisible();
  }

  async verifyProductNotInTable(productName) {
    await this.searchProduct(productName);
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await expect(productRow).not.toBeVisible();
    
    // También verificar mensaje de "no encontrado"
    if (await this.isElementVisible(this.noResultsMessage)) {
      await expect(this.page.locator(this.noResultsMessage)).toBeVisible();
    }
  }

  async clickAddProduct() {
    await this.page.click(this.addProductButton);
    await expect(this.page.locator(this.productForm)).toBeVisible();
  }

  async fillProductForm(productData) {
    if (productData.name !== undefined) {
      await this.page.fill(this.nameInput, productData.name);
    }
    if (productData.description) {
      await this.page.fill(this.descriptionInput, productData.description);
    }
    if (productData.price !== undefined) {
      await this.page.fill(this.priceInput, productData.price);
    }
    if (productData.category) {
      await this.page.selectOption(this.categorySelect, productData.category);
    }
    if (productData.stock !== undefined) {
      await this.page.fill(this.stockInput, productData.stock);
    }
    if (productData.sku) {
      await this.page.fill(this.skuInput, productData.sku);
    }
  }

  async saveProduct() {
    await this.page.click(this.saveButton);
    await this.waitForNetworkIdle();
  }

  async cancelProductForm() {
    await this.page.click(this.cancelButton);
  }

  async createProduct(productData) {
    await this.clickAddProduct();
    await this.fillProductForm(productData);
    await this.saveProduct();
  }

 /*  async editProduct(currentProductName, updatedData) {
    await this.searchProduct(currentProductName);
    const productRow = this.page.locator(`tr:has-text("${currentProductName}")`);
    await productRow.locator(this.editButton).click();
    
    await expect(this.page.locator(this.productForm)).toBeVisible();
    await this.fillProductForm(updatedData);
    await this.saveProduct();
  }

  async deleteProduct(productName) {
    await this.searchProduct(productName);
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await productRow.locator(this.deleteButton).click();
    
    // Confirmar eliminación en modal
    await expect(this.page.locator(this.confirmDeleteModal)).toBeVisible();
    await this.page.click(this.confirmDeleteButton);
    await this.waitForNetworkIdle();
  }

  async cancelDelete(productName) {
    await this.searchProduct(productName);
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await productRow.locator(this.deleteButton).click();
    
    await expect(this.page.locator(this.confirmDeleteModal)).toBeVisible();
    await this.page.click(this.cancelDeleteButton);
  }
 */
 /*  async verifySuccessMessage(expectedMessage = null) {
    await expect(this.page.locator(this.successMessage)).toBeVisible({ timeout: 5000 });
    
    if (expectedMessage) {
      await expect(this.page.locator(this.successMessage)).toContainText(expectedMessage);
    }
  }

  async verifyErrorMessage(expectedMessage = null) {
    await expect(this.page.locator(this.errorMessage)).toBeVisible({ timeout: 5000 });
    
    if (expectedMessage) {
      await expect(this.page.locator(this.errorMessage)).toContainText(expectedMessage);
    }
  }

  async verifyValidationErrors(expectedErrors = null) {
    await expect(this.page.locator(this.validationErrors)).toBeVisible();
    
    if (expectedErrors && Array.isArray(expectedErrors)) {
      for (const error of expectedErrors) {
        await expect(this.page.locator(this.validationErrors)).toContainText(error);
      }
    }
  }
 */
  async getProductCount() {
    const rows = await this.page.locator(`${this.productsTable} tbody tr`).count();
    return rows;
  }
}

module.exports = ProductsPage;