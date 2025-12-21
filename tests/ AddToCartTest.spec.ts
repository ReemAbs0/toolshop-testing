import { test, expect } from '@playwright/test';
import { products } from '../pages/Products';
import { CartPOM } from '../pages/CartPOM';
import * as dotenv from 'dotenv';

dotenv.config();

for (const product of products) {

    test('Add to Cart Test for ' + product.name, async ({ page }) => {

        const cartPOM = new CartPOM(page);

        await page.goto(process.env.BASE_URL!);

        await page.locator(product.url).click();

        await cartPOM.addProductToCart();
        await cartPOM.goToCheckout("//span[@data-test='cart-quantity']");


        await page.goto(process.env.BASE_URL!);

    });
}