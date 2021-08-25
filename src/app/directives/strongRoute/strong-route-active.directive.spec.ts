import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StrongRoute } from "@interfaces/strongRoute";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { StrongRouteActiveDirective } from "./strong-route-active.directive";
import { StrongRouteDirective } from "./strong-route.directive";

@Component({
  template: `
    <a
      [strongRoute]="route"
      [strongRouteActive]="klass"
      [strongRouteActiveOptions]="activeOptions"
    >
      Link
    </a>
  `,
})
class MockComponent {
  @Input() public route: StrongRoute;
  @Input() public klass: string;
  @Input() public activeOptions: { exact: boolean };
}

describe("StrongRouteActiveDirective", () => {
  let router: Router;
  let spec: Spectator<MockComponent>;
  const baseRoute = StrongRoute.newRoot();
  const defaultRoute = baseRoute.add("home");
  const createDirective = createComponentFactory({
    component: MockComponent,
    declarations: [StrongRouteDirective, StrongRouteActiveDirective],
    imports: [
      MockAppConfigModule,
      RouterTestingModule.withRoutes([
        {
          path: baseRoute.toRouteCompilePath(),
          pathMatch: "full",
          component: MockComponent,
        },
        {
          path: defaultRoute.toRouteCompilePath(),
          component: MockComponent,
        },
      ]),
    ],
  });

  function setup(
    route: StrongRoute,
    klass: string,
    activeOptions?: { exact: boolean }
  ) {
    spec = createDirective({ props: { route, klass, activeOptions } });
    router = spec.inject(Router);
    router.initialNavigation();
  }

  async function changeRoute(strongRoute: StrongRoute) {
    await router.navigate([strongRoute.toRouterLink()]);
  }

  function getDirective() {
    return spec.query(StrongRouteActiveDirective);
  }

  function getLink() {
    return spec.element.querySelector("a");
  }

  it("should not set class when url does not match", () => {
    setup(baseRoute, "active");
    expect(getLink()).not.toHaveClass("active");
  });

  it("should set class when url matches", async () => {
    setup(defaultRoute, "active");
    await changeRoute(defaultRoute);
    expect(getLink()).toHaveClass("active");
  });

  it("should accept active options", () => {
    setup(baseRoute, "active", { exact: true });
    expect(getDirective().routerLinkActiveOptions).toEqual({ exact: true });
  });
});
