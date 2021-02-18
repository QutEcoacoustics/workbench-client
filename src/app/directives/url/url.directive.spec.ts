import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { StrongRoute } from "@interfaces/strongRoute";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { UrlDirective } from "./url.directive";

describe("UrlDirective", () => {
  let router: Router;
  let route: ActivatedRoute;
  let spec: SpectatorDirective<UrlDirective>;
  const createDirective = createDirectiveFactory({
    directive: UrlDirective,
    imports: [RouterTestingModule],
  });

  const createRouterLink = createDirectiveFactory({
    directive: RouterLinkWithHref,
    declarations: [StrongRouteDirective],
    imports: [RouterTestingModule],
  });

  function assertUrlTree(url: string, queryParams?: Params) {
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

  function setup(url: string) {
    spec = createDirective('<a [url]="url"></a>', { hostProps: { url } });
    router = spec.inject(Router);
    route = spec.inject(ActivatedRoute);
  }

  it("should not interfere with routerLink if no [url]", () => {
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

  describe("url", () => {
    let root: StrongRoute;

    beforeEach(() => (root = StrongRoute.newRoot()));

    it("should handle undefined url", () => {
      setup(undefined);
      spec.detectChanges();
      assertRoute("/");
    });

    it("should handle null url", () => {
      setup(null);
      spec.detectChanges();
      assertRoute("/");
    });

    it("should handle root path", () => {
      const baseRoute = root;
      setup(baseRoute.format());
      spec.detectChanges();
      assertRoute("/");
    });

    it("should handle path", () => {
      const childRoute = root.add("home");
      setup(childRoute.format());
      spec.detectChanges();
      assertRoute("/home");
    });

    it("should handle single route parameter", () => {
      const childRoute = root.add(":id");
      setup(childRoute.format({ id: 5 }));
      spec.detectChanges();
      assertRoute("/5");
    });

    it("should handle multiple route parameters", () => {
      const childRoute = root.add(":id").add(":name");
      setup(childRoute.format({ id: 5, name: "example" }));
      spec.detectChanges();
      assertRoute("/5/example");
    });

    it("should handle single query parameter", () => {
      const childRoute = root.add("home", ({ id }) => ({ id }));
      setup(childRoute.format(undefined, { id: 5 }));
      spec.detectChanges();
      assertRoute("/home?id=5");
    });

    it("should handle query parameter with special characters", () => {
      const childRoute = root.add("home", ({ name }) => ({ name }));
      setup(childRoute.format(undefined, { name: "example encoding" }));
      spec.detectChanges();
      assertRoute("/home?name=example%20encoding");
    });

    it("should handle multiple query parameters", () => {
      const childRoute = root.add("home", ({ id, name }) => ({ id, name }));
      setup(childRoute.format(undefined, { id: 5, name: "example" }));
      spec.detectChanges();
      assertRoute("/home?id=5&name=example");
    });

    it("should handle multiple query parameters with special characters", () => {
      const childRoute = root.add("home", ({ id, name }) => ({ id, name }));
      setup(childRoute.format(undefined, { id: 5, name: "example encoding" }));
      spec.detectChanges();
      assertRoute("/home?id=5&name=example%20encoding");
    });

    it("should handle path with route and query parameters", () => {
      const childRoute = root
        .add(":siteId")
        .add(":siteName", ({ id, name }) => ({ id, name }));
      setup(
        childRoute.format(
          { siteId: 5, siteName: "example" },
          { id: 10, name: "example encoding" }
        )
      );
      spec.detectChanges();
      assertRoute("/5/example?id=10&name=example%20encoding");
    });
  });

  describe("urlTree", () => {
    it("should create root url tree", () => {
      const baseRoute = StrongRoute.newRoot();
      setup(baseRoute.format());
      spec.detectChanges();
      assertUrlTree("/", {});
    });

    it("should create url tree", () => {
      const baseRoute = StrongRoute.newRoot().add("home");
      setup(baseRoute.format());
      spec.detectChanges();
      assertUrlTree("/home", {});
    });
    it("should create url tree with with route and query parameters", () => {
      const childRoute = StrongRoute.newRoot().add(":id");
      setup(childRoute.format({ id: 5 }));
      spec.detectChanges();
      assertUrlTree("/5");
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should create url tree with query parameters", () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, name }) => ({ test, name })
      );
      setup(childRoute.format(undefined, { name: "example" }));
      spec.detectChanges();
      spec.directive["queryParams"] = { test: 5 };
      assertUrlTree("/home", { test: 5, name: "example" });
    });

    // TODO Update this to work through the router instead of bypassing it
    it("should create url tree with with route and query parameters", () => {
      const childRoute = StrongRoute.newRoot().add(":id", ({ test, name }) => ({
        test,
        name,
      }));
      setup(childRoute.format({ id: 5 }, { name: "example" }));
      spec.detectChanges();
      spec.directive["queryParams"] = { test: 5 };
      assertUrlTree("/5", { test: 5, name: "example" });
    });
  });
});
