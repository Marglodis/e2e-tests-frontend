class BasePage {
  constructor(page) {
    this.page = page;
  }

  async waitForElement(selector, timeout = 5000) {
    return await this.page.waitForSelector(selector, { timeout });
  }

  async isElementVisible(selector, timeout = 3000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = BasePage;