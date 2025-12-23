import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPOM';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Dynamic Search Feature', () => {
  test('results should match entered keyword', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await page.waitForTimeout(8000);
    const keyword = process.env.SEARCH_KEYWORD || "no found";
    await searchPage.searchProduct(keyword);

    const titles = await searchPage.getProductTitles();

    for (const title of titles) {
      expect(title.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });
});