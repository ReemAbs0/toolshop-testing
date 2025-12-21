import { test } from '@playwright/test';
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
});
