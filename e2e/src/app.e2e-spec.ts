import { AppPage } from "./app.po";

describe("workbench-client", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it("should display ecosounds title", () => {
    expect(page.getLogo()).toEqual("<< brandName >>");
  });

  xit("should update navbar on logout", () => {});

  xit("should update home component on logout", () => {});

  xit("should run form guard and detect dirty forms", () => {});

  xit("should load config from API", () => {});
});
