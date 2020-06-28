import { browser, logging } from "protractor";
import { AppPage } from "./app.po";
import { LoginPage } from "./login.po";

describe("workbench-client", () => {
  let page: AppPage;
  let loginPage: LoginPage;

  beforeEach(() => {
    page = new AppPage();
    loginPage = new LoginPage();
    page.navigateTo();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });

  it("should display ecosounds title", () => {
    expect(page.getLogo()).toEqual("<< brandName >>");
  });

  xit("should update navbar on login", () => {
    page.login();
    loginPage.getUsernameInput().sendKeys("username");
    loginPage.getPasswordInput().sendKeys("password");
    loginPage.submitForm();

    page.logout();
  });

  xit("should update navbar on logout", () => {});

  xit("should handle fullscreen pages", () => {});

  xit("should handle menu pages", () => {});

  xit("should update home component on logout", () => {});

  xit("should display loading bar for long API requests", () => {});

  xit("should run form guard and detect dirty forms", () => {});
});
