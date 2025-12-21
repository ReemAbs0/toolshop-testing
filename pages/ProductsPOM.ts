import { Page, Locator, expect } from '@playwright/test';

export class ProductsPOM {
  readonly page: Page;
  readonly sortSelect: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.locator('[data-test="sort"]');
    this.products = page.locator('a.card');
  }

  async open(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(this.products.first()).toBeVisible({ timeout: 15000 });
  }

  private async selectSort(label: RegExp) {
    const options = await this.sortSelect.locator('option').allTextContents();
    const choice = options.find(o => label.test(o));
    if (!choice) throw new Error('Sort option not found');
    await this.sortSelect.selectOption({ label: choice });
  }

  async sortByNameAZ() {
  const firstBefore = await this.products
    .first()
    .locator('.card-title')
    .innerText();

  await this.selectSort(/name.*a.*z/i);

  await expect.poll(async () => {
    const firstAfter = await this.products
      .first()
      .locator('.card-title')
      .innerText();
    return firstAfter;
  }).not.toBe(firstBefore);
}

  async sortByPriceHighLow() {
    await this.selectSort(/price.*high.*low/i);
  }

  async getFirstNames(limit = 8): Promise<string[]> {
    const count = Math.min(limit, await this.products.count());
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      names.push(
        (await this.products.nth(i).locator('.card-title').innerText()).trim()
      );
    }

    return names;
  }

  async getFirstPrices(limit = 8): Promise<number[]> {
    const count = Math.min(limit, await this.products.count());
    const prices: number[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.products
        .nth(i)
        .locator('text=/\\$|€/').first()
        .innerText();

      prices.push(Number(text.replace(/[^0-9.]/g, '')));
    }

    return prices;
  }

  async verifyNamesSortedAZ() {
    const names = await this.getFirstNames();
    const sorted = [...names].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    expect(names).toEqual(sorted);
  }

  async verifyPricesSortedHighLow() {
    const prices = await this.getFirstPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  }
}
