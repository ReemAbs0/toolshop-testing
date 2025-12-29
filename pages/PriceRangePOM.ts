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
    await this.minSlider.waitFor();
    await this.maxSlider.waitFor();
  }

  private async getValue(slider: Locator): Promise<number> {
    return Number(await slider.getAttribute('aria-valuenow'));
  }

  private async move(slider: Locator, targetValue: number) {
    await slider.scrollIntoViewIfNeeded();

    const box = await slider.boundingBox();
    if (!box) throw new Error('Slider not visible');

    const min = Number(await slider.getAttribute('aria-valuemin'));
    const max = Number(await slider.getAttribute('aria-valuemax'));

    const value = Math.max(min, Math.min(max, targetValue));
    const ratio = (value - min) / (max - min);

    const clickX = box.x + ratio * box.width;
    const clickY = box.y + box.height / 2;

    await this.page.mouse.click(clickX, clickY);
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

  async verifyPricesInRange(min: number, max: number) {
    const count = await this.products.count();

    for (let i = 0; i < Math.min(8, count); i++) {
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
