import { Page } from '@playwright/test';

export class BrandPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async filterByBrand(brand: string) {
    const brandCheckbox = this.page.locator(`text=${brand}`).locator('..').locator('input[type="checkbox"]');

    if (await brandCheckbox.count() > 0) {
      await brandCheckbox.first().scrollIntoViewIfNeeded();
      await brandCheckbox.first().check();
    } else {
      throw new Error(`Checkbox for brand "${brand}" not found`);
    }

    await Promise.race([
      this.page.waitForSelector('.product-title', { timeout: 5000 }).catch(() => {}),
      this.page.waitForSelector('text=No products found', { timeout: 5000 }).catch(() => {})
    ]);
  }

  async getProductTitles() {
    return this.page.locator('.product-title').allTextContents();
  }
}