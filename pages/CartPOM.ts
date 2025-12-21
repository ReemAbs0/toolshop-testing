import { Page, expect } from '@playwright/test';

export class CartPOM {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToCheckout(baseUrl: string) {
    await this.page.goto(`${baseUrl}/checkout`);
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async removeProduct(name: string) {
    const row = this.page.locator('tr', { hasText: name });
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.locator('.btn-danger').click();
  }

  async verifyCartIsEmpty() {
    await expect(
      this.page.getByText(/the cart is empty/i)
    ).toBeVisible({ timeout: 10000 });
  }
}
