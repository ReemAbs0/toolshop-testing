import { test, expect } from '@playwright/test';
import { PriceRangePOM } from '../pages/PriceRangePOM';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Price Range', () => {
  let priceRange: PriceRangePOM;

  test.beforeEach(async ({ page }) => {
    priceRange = new PriceRangePOM(page);
  });

  test('Products are filtered when price range changes', async ({ page }) => {
    await priceRange.openPage(process.env.BASE_URL!);

    const requestedMin = 30;
    const requestedMax = 120;

    const { appliedMin, appliedMax } =
      await priceRange.applyPriceRange(requestedMin, requestedMax);

    console.log('Requested:', requestedMin, requestedMax);
    console.log('Applied:', appliedMin, appliedMax);

    await expect(page.locator('a.card').first()).toBeVisible();
    await priceRange.verifyPricesInRange(appliedMin, appliedMax);
  });
});
/*import { test } from '@playwright/test';
import { PriceRangePOM } from '../pages/PriceRangePOM';
import * as dotenv from 'dotenv';

dotenv.config();

const ranges = [
  [70, 170],
  [30, 120],
  [100, 200],
];

test.describe('Price Range', () => {
  for (const [min, max] of ranges) {
    test(`Products respect price range from ${min} to ${max}`, async ({ page }) => {
      const priceRange = new PriceRangePOM(page);

      await priceRange.openPage(process.env.BASE_URL!);

      const { appliedMin, appliedMax } =
        await priceRange.applyPriceRange(min, max);

      await priceRange.verifyPricesInRange(appliedMin, appliedMax);
    });
  }
});*/ 