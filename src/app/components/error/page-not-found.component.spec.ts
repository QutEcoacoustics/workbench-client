import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { MockDirective } from "ng-mocks";
import { PageNotFoundComponent } from "./page-not-found.component";

describe("PageNotFoundComponent", () => {
  let spec: Spectator<PageNotFoundComponent>;

  const createComponent = createComponentFactory({
    component: PageNotFoundComponent,
    imports: [MockDirective(StrongRouteDirective)],
  });

  beforeEach(() => {
    spec = createComponent();
  });

  it("should create", () => {
    expect(spec.element).toBeTruthy();
  });

  it("should have title", () => {
    expect(spec.element).toHaveText("Not Found");
  });

  it("should have message", () => {
    expect(spec.element).toHaveText("This page doesn't seem to exist");
  });
});
