import { browser, by, element } from "protractor";

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getNavbar() {
    return element(by.css("nav"));
  }

  getLogo() {
    return element(by.css("nav .navbar-brand")).getText();
  }

  login() {
    return element(by.id("login-header-link")).click();
  }

  logout() {
    return element(by.id("logout-header-link")).click();
  }
}
