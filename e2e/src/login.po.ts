import { by, element } from "protractor";

export class LoginPage {
  getUsernameInput() {
    return element(by.css("input[type=text]"));
  }

  getPasswordInput() {
    return element(by.css("input[type=password]"));
  }

  submitForm() {
    element(by.css("button[type=submit]")).click();
  }
}
