import { browser, by, element } from "protractor";

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css("app-root h1.display-4")).getText() as Promise<
      string
    >;
  }

  // TODO Logout should direct to home component
  // TODO Add test to verify fullscreen and menu layout pages render
  // TODO Add test to verify ngx-loading-bar is rendered after 3 seconds
  // TODO Home component should update projects when logout occurs
}
