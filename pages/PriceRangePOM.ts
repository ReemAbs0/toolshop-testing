import { Page, Locator, expect } from '@playwright/test';

export class PriceRangePOM {
  readonly page: Page;
  readonly products: Locator;
  readonly minSlider: Locator;
  readonly maxSlider: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator('a.card');
    this.minSlider = page.locator('.ngx-slider-pointer-min');
    this.maxSlider = page.locator('.ngx-slider-pointer-max');
  }

  async openPage(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(this.minSlider).toBeVisible({ timeout: 15000 });
    await expect(this.maxSlider).toBeVisible({ timeout: 15000 });
    await expect(this.products.first()).toBeVisible({ timeout: 15000 });
  }

  private async getValue(slider: Locator): Promise<number> {
    return Number(await slider.getAttribute('aria-valuenow'));
  }

  private async move(slider: Locator, targetValue: number) {
    const box = await slider.boundingBox();
    if (!box) throw new Error('Slider not visible');

    const current = await this.getValue(slider);
    const min = Number(await slider.getAttribute('aria-valuemin'));
    const max = Number(await slider.getAttribute('aria-valuemax'));

    const width = 200; 
    const offset = ((targetValue - current) / (max - min)) * width;

    await this.page.mouse.move(
      box.x + box.width / 2,
      box.y + box.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(
      box.x + box.width / 2 + offset,
      box.y + box.height / 2,
      { steps: 10 }
    );
    await this.page.mouse.up();

    await this.page.waitForTimeout(300);
  }

  async applyPriceRange(
    min: number,
    max: number
  ): Promise<{ appliedMin: number; appliedMax: number }> {
    await this.move(this.minSlider, min);
    await this.move(this.maxSlider, max);

    return {
      appliedMin: await this.getValue(this.minSlider),
      appliedMax: await this.getValue(this.maxSlider),
    };
  }

  async verifyPricesInRange(min: number, max: number, limit = 8) {
    const total = await this.products.count();
    const count = Math.min(limit, total);

    for (let i = 0; i < count; i++) {
      const priceText = await this.products
        .nth(i)
        .locator('text=/\\$|€/')
        .first()
        .innerText();

      const price = Number(priceText.replace(/[^0-9.]/g, ''));

      expect(price).toBeGreaterThanOrEqual(min - 2);
      expect(price).toBeLessThanOrEqual(max + 2);
    }
  }
}
