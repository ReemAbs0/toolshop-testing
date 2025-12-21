import { test } from '@playwright/test';
import { products } from '../pages/Products';
import { CartPOM } from '../pages/CartPOM';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Remove from cart', () => {
  let cart: CartPOM;

  test.beforeEach(async ({ page }) => {
    cart = new CartPOM(page);
    await page.goto(process.env.BASE_URL!);
  });

  for (const product of products) {
    test(`Remove ${product.name} from cart`, async ({ page }) => {
      await page.locator(product.url).click();
      await page.locator('[data-test="add-to-cart"]').click();

      await cart.goToCheckout(process.env.BASE_URL!);
      await cart.removeProduct(product.name);
      await cart.verifyCartIsEmpty();
    });
  }
});
