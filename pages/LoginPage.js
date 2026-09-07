export class LoginPage {
  constructor(page) {
    this.page = page;

    // Nav elements that open the login modal
    this.loginNavLink = page.locator('#login2');

    // Modal elements
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.submitButton = page.locator("button[onclick='logIn()']");
  }

  async goto() {
    await this.page.goto('/index.html');
  }

  async openLoginModal() {
    await this.loginNavLink.click();
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username, password) {
    await this.openLoginModal();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
