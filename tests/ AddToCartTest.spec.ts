import { test, expect } from '@playwright/test';
import { products } from '../pages/Products';
import { CartPOM } from '../pages/CartPOM';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Adding To cart', () => {
    let cart: CartPOM;

    test.beforeEach(async ({ page }) => {
        cart = new CartPOM(page);
        await page.goto(process.env.BASE_URL!);
    });
    for (const product of products) {

        test('Add to Cart Test for ' + product.name, async ({ page }) => {

            await page.goto(process.env.BASE_URL!);

            await page.locator(product.url).click();

            await cart.addProductToCart();
            await cart.goToCheckout(process.env.BASE_URL!);

            await page.goto(process.env.BASE_URL!);

        });
    }
});