import { test, expect } from '@playwright/test';
import { LoginPOM } from '../pages/LoginPOM';
import * as dotenv from 'dotenv';
dotenv.config();


test('user login test', async ({ page }) => {
    const loginPOM = new LoginPOM(page);

    await page.goto(process.env.BASE_URL!);
    await loginPOM.navigateToLoginPage();

    await loginPOM.loginUser(process.env.USER_Gmail!, process.env.PASSWORD!);
    await loginPOM.verifyLoginSuccess();

    await page.pause();
});