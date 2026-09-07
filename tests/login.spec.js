import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import users from '../test-data/users.json' assert { type: 'json' };

test.describe('Login Workflow - demoblaze.com Authentication Suite', () => {
  let loginPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
  });

  test('TC01 - Successful login with valid credentials', async ({ page }) => {
    const { username, password } = users.validUser;
    await loginPage.login(username, password);

    await expect(homePage.welcomeText).toBeVisible();
    const text = await homePage.getWelcomeText();
    expect(text).toContain(username);
  });

  test('TC02 - Login fails with incorrect username', async ({ page }) => {
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const { username, password } = users.invalidUsername;
    await loginPage.login(username, password);

    await expect.poll(() => alertMessage).toContain('User does not exist');
  });

  test('TC03 - Login fails with incorrect password', async ({ page }) => {
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const { username, password } = users.invalidPassword;
    await loginPage.login(username, password);

    await expect.poll(() => alertMessage).toContain('Wrong password');
  });

  test('TC04 - Login fails with empty credentials', async ({ page }) => {
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const { username, password } = users.emptyCredentials;
    await loginPage.login(username, password);

    await expect.poll(() => alertMessage).toContain('Please fill out');
  });

  test('TC05 - Password field masks input (security check)', async ({ page }) => {
    await loginPage.openLoginModal();
    const inputType = await loginPage.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('TC06 - Logout redirects and hides welcome text', async ({ page }) => {
    const { username, password } = users.validUser;
    await loginPage.login(username, password);
    await expect(homePage.welcomeText).toBeVisible();

    await homePage.logout();
    await expect(homePage.welcomeText).toBeHidden();
    await expect(loginPage.loginNavLink).toBeVisible();
  });
});
