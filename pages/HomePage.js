export class HomePage {
  constructor(page) {
    this.page = page;

    this.welcomeText = page.locator('#nameofuser');
    this.logoutLink = page.locator('#logout2');
  }

  async isLoggedIn() {
    return this.welcomeText.isVisible();
  }

  async getWelcomeText() {
    return this.welcomeText.textContent();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
