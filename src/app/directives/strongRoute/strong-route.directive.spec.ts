import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { StrongRouteDirective } from "./strong-route.directive";

// TODO Some tests work by bypassing the angular router. This can be solved by navigating
// to a page with parameters set in the url. This will allow simulating the route changes
// within the constraints of the testing framework

describe("StrongRouteDirective", () => {
  let router: Router;
  let route: ActivatedRoute;
  let spec: SpectatorDirective<StrongRouteDirective>;
  const createDirective = createDirectiveFactory({
    directive: StrongRouteDirective,
    imports: [RouterTestingModule, MockAppConfigModule],
  });

  const createRouterLink = createDirectiveFactory({
    directive: RouterLinkWithHref,
    declarations: [StrongRouteDirective],
    imports: [RouterTestingModule],
  });

  function assertUrlTree(url: string, queryParams: Params) {
    expect(spec.directive.urlTree).toEqual(
      router.createUrlTree([url], {
        queryParams,
        relativeTo: route,
        fragment: spec.directive.fragment,
        queryParamsHandling: spec.directive.queryParamsHandling,
        preserveFragment: spec.directive.preserveFragment,
      })
    );
  }

  function assertRoute(link: string) {
    const href = spec.query<HTMLAnchorElement>("a").href;
    const url = new URL(href, document.baseURI);
    expect(url.pathname + url.search).toBe(link);
  }

  function setup(
    strongRoute: StrongRoute,
    routeParams?: RouteParams,
    queryParams?: Params
  ) {
    spec = createDirective(
      `
        <a
          [strongRoute]="strongRoute"
          [routeParams]="routeParams"
          [queryParams]="queryParams"
        ></a>
      `,
      { hostProps: { strongRoute, routeParams, queryParams } }
    );
    router = spec.inject(Router);
    route = spec.inject(ActivatedRoute);
  }

  it("should not interfere with routerLink if no [strongRoute]", () => {
    const spectator = createRouterLink(
      '<a [routerLink]="link" [queryParams]="params"></a>',
      { hostProps: { link: "/home", params: { test: "value" } } }
    );
    spectator.detectChanges();

    const routerLink = spectator.query(RouterLinkWithHref);
    expect(routerLink).toBeInstanceOf(RouterLinkWithHref);
    expect(routerLink.href).toContain("/home?test=value");
  });

  // TODO Current implementation does not work with routerLinkActive
  xit("should not interfere with routerLinkActive", () => {});

  describe("strongRoute", () => {
    it("should handle undefined strongRoute", () => {
      setup(undefined);
      spec.detectChanges();
      expect(spec.directive instanceof StrongRouteDirective).toBeTrue();
    });

    it("should handle null strongRoute", () => {
      setup(null);
      spec.detectChanges();
      expect(spec.directive instanceof StrongRouteDirective).toBeTrue();
    });

    it("should handle root strongRoute", () => {
      const baseRoute = StrongRoute.newRoot();
      setup(baseRoute);
      spec.detectChanges();
      assertRoute("/");
    });

    it("should handle strongRoute", () => {
      const childRoute = StrongRoute.newRoot().add("home");
      setup(childRoute);
      spec.detectChanges();
      assertRoute("/home");
    });
  });

  describe("routeParams", () => {
    it("should handle strongRoute with single parameter", () => {
      const paramRoute = StrongRoute.newRoot().add(":id");
      setup(paramRoute, { id: 5 });
      spec.detectChanges();
      assertRoute("/5");
    });

    it("should handle strongRoute with multiple parameters", () => {
      const paramRoute = StrongRoute.newRoot().add(":type").add(":id");
      setup(paramRoute, { id: 5, type: "home" });
      spec.detectChanges();
      assertRoute("/home/5");
    });
  });

  describe("queryParams", () => {
    it("should handle strongRoute with query parameter", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
        test,
      }));
      setup(childRoute, undefined, { test: "value" });
      spec.detectChanges();
      assertRoute("/home?test=value");
    });

    it("should handle strongRoute with multiple query parameter", () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          test,
          example,
        })
      );
      setup(childRoute, undefined, { example: 5, test: "value" });
      spec.detectChanges();
      assertRoute("/home?test=value&example=5");
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should handle strongRoute with router query parameter", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
        testing: test,
      }));
      setup(childRoute);
      spec.detectChanges();
      spec.directive["angularRouteParams"] = { test: "value" };
      assertUrlTree("/home", { testing: "value" });
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should handle strongRoute with multiple router query parameter", () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute);
      spec.detectChanges();
      spec.directive["angularRouteParams"] = { example: 5, test: "value" };
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should combine route query parameters and queryParams", () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute, undefined, { test: "value" });
      spec.detectChanges();
      spec.directive["angularRouteParams"] = { example: 5 };
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });
  });

  describe("urlTree", () => {
    it("should create root url tree", () => {
      const baseRoute = StrongRoute.newRoot();
      setup(baseRoute);
      spec.detectChanges();
      assertUrlTree("/", {});
    });

    it("should create url tree", () => {
      const baseRoute = StrongRoute.newRoot().add("home");
      setup(baseRoute);
      spec.detectChanges();
      assertUrlTree("/home", {});
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should create url tree with query parameters from router", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ example }) => ({
        testing: example,
      }));
      setup(childRoute);
      spec.detectChanges();
      spec.directive["angularRouteParams"] = { example: 5 };
      assertUrlTree("/home", { testing: 5 });
    });

    it("should create url tree with custom query parameters", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
        testing: test,
      }));
      setup(childRoute, undefined, { test: "value" });
      spec.detectChanges();
      assertUrlTree("/home", { testing: "value" });
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should create url tree with with custom and router query parameters", () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute, undefined, { test: "value" });
      spec.detectChanges();
      spec.directive["angularRouteParams"] = { example: 5 };
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });
  });
});
