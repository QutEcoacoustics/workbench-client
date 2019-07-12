import { browser, by, element } from "protractor"

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>
  }

  getTitleText() {
    return element(by.css("app-root h1.display-4")).getText() as Promise<string>
  }
}
