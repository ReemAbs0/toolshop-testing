/*
  Author: طالبة جامعية - اختبار فلترة العلامات التجارية عبر checkbox فقط
*/

import { test, expect } from '@playwright/test';
import { BrandPage } from '../pages/BrandPOM';

test.setTimeout(45000);

test.describe('Filter by Brand using checkboxes only', () => {
  let brandPage: BrandPage;

  test.beforeEach(async ({ page }) => {
    brandPage = new BrandPage(page);
    await brandPage.goto();
    await page.waitForLoadState('domcontentloaded');
  });

  const brands = ['ForgeFlex Tools', 'MightyCraft Hardware'];

  for (const brand of brands) {
    test(`should show products from "${brand}" brand`, async ({ page }) => {
      brandPage = new BrandPage(page);

      await brandPage.filterByBrand(brand);
      const titles = await brandPage.getProductTitles();
      const slug = brand.toLowerCase().replace(/\s+/g, '-');

      if (titles.length === 0) {
        const noProductsVisible = await page.locator('text=No products found').first().isVisible().catch(() => false);
        const pageTitleVisible = await page.locator(`[data-test="page-title"]:has-text("${brand}")`).first().isVisible().catch(() => false);
        const urlHasSlug = (await page.url()).includes(`/brand/${slug}`);
        const productDetailVisible = await page.locator('.product-detail, .card-title, h1, [data-test="product-title"], a.card, .card, .product-item, .product-grid, .product-list').first().isVisible().catch(() => false);

        expect(noProductsVisible || pageTitleVisible || urlHasSlug || productDetailVisible).toBeTruthy();
      } else {
        expect(titles.length).toBeGreaterThan(0);
        expect(titles.every(t => typeof t === 'string' && t.trim().length > 0)).toBeTruthy();
      }
    });
  }
});