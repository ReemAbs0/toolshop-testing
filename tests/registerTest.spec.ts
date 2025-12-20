import { test, expect } from '@playwright/test';
import { RegisterPOM } from '../pages/RegisterPOM';
import * as dotenv from 'dotenv';
dotenv.config();

test('user registration test', async ({ page }) => {
    const registerPOM = new RegisterPOM(page);

    await page.goto(process.env.BASE_URL!);
    await page.goto('https://practicesoftwaretesting.com/auth/login');
    await registerPOM.navigateToRegisterPage();

    await registerPOM.registerUser(
        'standard',
        'user',
        '2000-01-01',
        'abc street',
        '12345',
        'Jerusalem',
        '12345',
        'Israel',
        '1234567890',
        'standard.user@gmail.com',
        'TestUser12345!@'
    );


    await registerPOM.verifyRegistrationSuccess();

    await page.pause();
});