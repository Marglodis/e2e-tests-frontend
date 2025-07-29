const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');

BeforeAll(async function () {
  console.log('🚀 Iniciando Suite de Pruebas E2E - Sistema de Productos');
  console.log('📅 Fecha:', new Date().toLocaleString());
});

Before(async function (scenario) {
  console.log(`\n🧪 Ejecutando: ${scenario.pickle.name}`);
  await this.init();
});

After(async function (scenario) {
  // Capturar screenshot si la prueba falló
  if (scenario.result.status === 'FAILED') {
    console.log('❌ Prueba falló, capturando screenshot...');
    const screenshotName = `failed-${scenario.pickle.name.replace(/\s+/g, '-').toLowerCase()}`;
    await this.loginPage.takeScreenshot(screenshotName);
    
    // Adjuntar screenshot al reporte
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  } else {
    console.log('✅ Prueba exitosa');
  }
  
  // Logout si está logueado
  try {
    await this.loginPage.logout();
  } catch (error) {
    // Ignorar errores de logout
  }
  
  await this.cleanup();
});

AfterAll(async function () {
  console.log('🏁 Suite de pruebas completada');
});