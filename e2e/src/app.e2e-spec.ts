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

  /**
   * While this expectation is good, currently it will always fail because
   * the CMS throws an error when attempting to insert styles/scripts from
   * a different domain.
   */
  /* afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  }); */

  it("should display ecosounds title", () => {
    expect(page.getLogo()).toEqual("<< brandName >>");
  });

  xit("should update navbar on logout", () => {});

  xit("should update home component on logout", () => {});

  xit("should run form guard and detect dirty forms", () => {});

  xit("should load config from API", () => {});
});
