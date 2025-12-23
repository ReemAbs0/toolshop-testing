import { Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async searchProduct(keyword: string) {
    await this.page.fill('input[placeholder="Search"]', keyword);
    await this.page.press('input[placeholder="Search"]', 'Enter');
  }

  async getProductTitles() {
    return this.page.locator('.product-title').allTextContents();
  }
}