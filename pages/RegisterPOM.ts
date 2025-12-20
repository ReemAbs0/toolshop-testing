import { expect, Page } from '@playwright/test';

export class RegisterPOM {

    private firstnameInput;
    private lastnameInput;
    private dateOfBirthInput;
    private streetInput;
    private postalCodeInput;
    private cityInput;
    private stateInput;
    private countryInput;
    private phoneInput;
    private emailInput;
    private passwordInput;
    private registerButton;

    constructor(private page: Page) {
        this.firstnameInput = this.page.locator("input[placeholder='First name *']");
        this.lastnameInput = this.page.locator("input[placeholder='Your last name *']");
        this.dateOfBirthInput = this.page.locator("input[placeholder='YYYY-MM-DD']");
        this.streetInput = this.page.locator("input[placeholder='Your Street *']");
        this.postalCodeInput = this.page.locator("input[placeholder='Your Postcode *']");
        this.cityInput = this.page.locator("input[placeholder='Your City *']");
        this.stateInput = this.page.locator("input[placeholder='Your State *']");
        this.countryInput = this.page.locator("select[data-test='country']");
        this.phoneInput = this.page.locator("input[placeholder='Your phone *']");
        this.emailInput = this.page.locator("input[placeholder='Your email *']");
        this.passwordInput = this.page.locator("input[placeholder='Your password']");
        this.registerButton = this.page.locator("button[data-test='register-submit']");
    }

    async registerUser(firstname: string, lastname: string, dateOfBirth: string, street: string, postalCode: string, city: string, state: string, country: string, phone: string, email: string, password: string) {
        await this.firstnameInput.fill(firstname);
        await this.lastnameInput.fill(lastname);
        await this.dateOfBirthInput.fill(dateOfBirth);
        await this.streetInput.fill(street);
        await this.postalCodeInput.fill(postalCode);
        await this.cityInput.fill(city);
        await this.stateInput.fill(state);
        await this.countryInput.selectOption({ label: country });
        await this.phoneInput.fill(phone);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.registerButton.click();
    }

    async navigateToRegisterPage() {
        await this.page.goto('https://practicesoftwaretesting.com/auth/register');
    }

    async verifyRegistrationSuccess() {
        await expect(this.page).toHaveURL('https://practicesoftwaretesting.com/auth/login');
    }

}

