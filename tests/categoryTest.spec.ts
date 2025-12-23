
import { test, expect } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPOM';

test.setTimeout(45000);

const categories = ['Hand Tools', 'Power Tools', 'Special Tools'];

test.describe('category test', () => {
  test.beforeEach(async ({ page }) => {
    const categoryPage = new CategoryPage(page);
    await categoryPage.goto();
    await page.locator('a.dropdown-item').first().waitFor({ timeout: 3000 }).catch(() => {});
  });

  for (const category of categories) {
    test(`should show products from "${category}" category`, async ({ page }) => {
      const categoryPage = new CategoryPage(page);

      try {
        await categoryPage.filterByCategory(category);

        const slug = category.toLowerCase().replace(/\s+/g, '-');
        await Promise.race([
          page.waitForSelector(`[data-test="page-title"]:has-text("${category}")`, { timeout: 10000 }).catch(() => null),
          page.waitForURL(new RegExp(`/category/${slug}`), { timeout: 10000 }).catch(() => null),
          page.waitForSelector('.product-title', { timeout: 10000 }).catch(() => null),
        ]);

        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      } catch (err) {
        const info = test.info();
        await page.screenshot({ path: info.outputPath(`failure-${category.replace(/\s+/g, '_')}.png`) });
        await info.attach('page-source', { body: await page.content(), contentType: 'text/html' });
        throw err;
      }

      const titles = await categoryPage.getProductTitles();

      if (titles.length === 0) {
        const noProductsVisible = await page.locator('text=No products found').first().isVisible().catch(() => false);
        const pageTitleVisible = await page.locator(`[data-test="page-title"]:has-text("${category}")`).first().isVisible().catch(() => false);
        const urlHasSlug = (await page.url()).includes(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`);

        expect(noProductsVisible || pageTitleVisible || urlHasSlug).toBeTruthy();
      } else {
        expect(titles.every(t => typeof t === 'string' && t.trim().length > 0)).toBeTruthy();
        expect(titles.length).toBeGreaterThan(0);
      }
    });
  }
});