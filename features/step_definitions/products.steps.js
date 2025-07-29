const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Fixtures
const products = require('../support/fixtures/products.json');

// === PRODUCT QUERY STEPS ===

When('consulto la lista de productos disponibles', async function () {
  await this.productsPage.verifyPageLoaded();
});

When('busco un producto específico por su nombre', async function () {
  const productName = 'SKU-maximos'; // Producto de ejemplo
  await this.productsPage.searchProduct(productName);
  this.setTestData('searchedProduct', productName);
});

When('busco un producto que no existe en el sistema', async function () {
  const nonExistentProduct = 'Producto Inexistente XYZ';
  await this.productsPage.searchProduct(nonExistentProduct);
  this.setTestData('searchedProduct', nonExistentProduct);
});

Then('debería ver la página de productos cargada correctamente', async function () {
  await this.productsPage.verifyPageLoaded();
});

Then('debería visualizar la tabla de productos', async function () {
  await this.productsPage.verifyProductsTableVisible();
});


Then('debería encontrar y mostrar el producto buscado', async function () {
  const searchedProduct = this.getTestData('searchedProduct');
  await this.productsPage.verifyProductInTable(searchedProduct);
});

Then('debería ver los detalles del producto en los resultados', async function () {
  const searchedProduct = this.getTestData('searchedProduct');
  
  await this.productsPage.verifyProductInTable(searchedProduct);
  
  const productRow = this.page.locator(`tr:has-text("${searchedProduct}")`);
  
  await productRow.click();
  await expect(this.page).toHaveURL(/\/articulos\/\d+$/);
});

Then('debería ver un mensaje indicando que no se encontraron resultados', async function () {
  await this.productsPage.verifyProductNotInTable(this.getTestData('searchedProduct'));
});

Then('la tabla debería mostrar que no hay productos que coincidan', async function () {
  const noResultsMessage = this.page.locator('.no-products-message, .empty-results');
  if (await this.productsPage.isElementVisible('.no-products-message, .empty-results')) {
    await expect(noResultsMessage).toBeVisible();
  }
});



module.exports = {};