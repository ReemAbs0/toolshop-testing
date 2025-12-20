import { expect, Page } from '@playwright/test';

export class LoginPOM {

    private emailInput;
    private passwordInput;
    private loginButton;

    constructor(private page: Page) {
        this.emailInput = this.page.locator("input[placeholder='Your email']");
        this.passwordInput = this.page.locator("input[placeholder='Your password']");
        this.loginButton = this.page.locator("input[type='submit']");
    }

    async loginUser(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async navigateToLoginPage() {
        await this.page.goto('https://practicesoftwaretesting.com/auth/login');
    }

    async verifyLoginSuccess() {
        await expect(this.page).toHaveURL('https://practicesoftwaretesting.com/account');
    }
}