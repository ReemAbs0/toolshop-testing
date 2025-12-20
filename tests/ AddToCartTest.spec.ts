import { test, expect } from '@playwright/test';
import { products } from '../pages/Products';
import * as dotenv from 'dotenv';

dotenv.config();

for (const product of products) {

    test('Add to Cart Test for ' + product.name, async ({ page }) => {

        await page.goto(process.env.BASE_URL!);

        await page.locator(product.url).click();
        await page.locator("//button[@data-test='add-to-cart']").click();
        await page.locator("//span[@data-test='cart-quantity']").click();

        await expect(page).toHaveURL('https://practicesoftwaretesting.com/checkout');
        //page.pause();
    });
}