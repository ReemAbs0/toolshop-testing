/*import { test } from '@playwright/test';
import { ProductsPOM } from '../pages/ProductsPOM';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Sort', () => {
  let products: ProductsPOM;

  test.beforeEach(async ({ page }) => {
    products = new ProductsPOM(page);
    await products.open(process.env.BASE_URL!);
  });

  test('Sort by Name A-Z', async () => {
    await products.sortByNameAZ();
    await products.verifyNamesSortedAZ();
  });

  test('Sort by Price High to Low', async () => {
    await products.sortByPriceHighLow();
    await products.verifyPricesSortedHighLow();
  });
});
*/