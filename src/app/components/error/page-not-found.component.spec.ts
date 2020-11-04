import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PageNotFoundComponent } from "./page-not-found.component";

describe("PageNotFoundComponent", () => {
  let spec: Spectator<PageNotFoundComponent>;
  const createComponent = createComponentFactory(PageNotFoundComponent);

  beforeEach(() => (spec = createComponent()));

  it("should create", () => {
    expect(spec.element).toBeTruthy();
  });

  it("should have message", () => {
    expect(spec.element).toHaveText("Not Found! TODO: make me better!");
  });
});
