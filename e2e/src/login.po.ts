import { by, element } from "protractor";

export class LoginPage {
  public getUsernameInput() {
    return element(by.css("input[type=text]"));
  }

  public getPasswordInput() {
    return element(by.css("input[type=password]"));
  }

  public submitForm() {
    element(by.css("button[type=submit]")).click();
  }
}
