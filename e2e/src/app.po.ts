import { browser, by, element } from "protractor";

export class AppPage {
  public navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  public getNavbar() {
    return element(by.css("nav"));
  }

  public getLogo() {
    return element(by.css("nav .navbar-brand")).getText();
  }

  public login() {
    return element(by.id("login-header-link")).click();
  }

  public logout() {
    return element(by.id("logout-header-link")).click();
  }
}
