import { Page } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async filterByCategory(category: string) {
    const slug = category.toLowerCase().replace(/\s+/g, '-');

    const waitForSignals = async () => {
      await Promise.race([
        this.page.waitForURL(new RegExp(`/category/${slug}`), { timeout: 10000 }).catch(() => null),
        this.page.waitForSelector(`[data-test="page-title"]:has-text("${category}")`, { timeout: 10000 }).catch(() => null),
        this.page.waitForSelector('.product-title', { timeout: 10000 }).catch(() => null),
        this.page.locator('text=No products found').first().waitFor({ timeout: 10000 }).catch(() => null),
      ]);
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => null);
    };

    const byDataAttr = this.page.locator(`a[data-test="nav-${slug}"]`);
    if (await byDataAttr.count() > 0) {
      const link = byDataAttr.first();
      await link.scrollIntoViewIfNeeded();
      await Promise.all([
        waitForSignals(),
        link.click()
      ]);
      return;
    }

    const byAnchorText = this.page.locator(`a:has-text("${category}")`);
    if (await byAnchorText.count() > 0) {
      const link = byAnchorText.first();
      await link.scrollIntoViewIfNeeded();
      await Promise.all([
        waitForSignals(),
        link.click(),
      ]);
      return;
    }

    const catButton = this.page.locator('button:has-text("Categories")');
    if (await catButton.count() > 0) {
      await catButton.first().click();
      const dropdownLink = this.page.locator(`a:has-text("${category}")`);
      if (await dropdownLink.count() > 0) {
        const link = dropdownLink.first();
        await link.scrollIntoViewIfNeeded();
        await Promise.all([
          waitForSignals(),
          link.click(),
        ]);
        return;
      }
    }

    const fallback = this.page.locator(`text=${category}`);
    await fallback.first().scrollIntoViewIfNeeded();
    await Promise.all([
      waitForSignals(),
      fallback.first().click(),
    ]);
  }

  async getProductTitles() {
    const productFound = await this.page.waitForSelector('.product-title', { timeout: 5000 }).catch(() => null);
    if (productFound) {
      return this.page.locator('.product-title').allTextContents();
    }

    const noProducts = await this.page.locator('text=No products found').first().waitFor({ timeout: 2000 }).catch(() => null);
    if (noProducts) {
      return [];
    }

    return [];
  }
}