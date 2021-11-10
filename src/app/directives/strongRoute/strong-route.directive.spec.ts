import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
} from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateApiErrorDetailsV2 } from "@test/fakes/ApiErrorDetails";
import { generatePageInfo, nStepObservable } from "@test/helpers/general";
import { Subject } from "rxjs";
import { StrongRouteDirective } from "./strong-route.directive";

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

  function interceptRouteParams(params: Params) {
    const subject = new Subject();
    spec.directive["_route"].params = subject;
    return nStepObservable(subject, () => params);
  }
  async function setRouteParams(params: Params) {
    const promise = interceptRouteParams(params);
    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function interceptRouteData(data: IPageInfo) {
    const subject = new Subject();
    spec.directive["_route"].data = subject;
    return nStepObservable(subject, () => data);
  }

  async function setRouteData(data: IPageInfo) {
    const promise = interceptRouteData(data);
    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

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
      {
        hostProps: { strongRoute, routeParams, queryParams },
        detectChanges: false,
      }
    );
    router = spec.inject(Router);
    route = spec.inject(ActivatedRoute);
  }

  it("should not interfere with routerLink if no [strongRoute]", () => {
    const routerLinkSpec = createRouterLink(
      '<a [routerLink]="link" [queryParams]="params"></a>',
      { hostProps: { link: "/home", params: { test: "value" } } }
    );
    routerLinkSpec.detectChanges();

    const routerLink = routerLinkSpec.query(RouterLinkWithHref);
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

    it("should handle strongRoute with router query parameter", async () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
        testing: test,
      }));
      setup(childRoute);
      await setRouteParams({ test: "value" });
      assertUrlTree("/home", { testing: "value" });
    });

    it("should handle strongRoute with multiple router query parameter", async () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute);
      await setRouteParams({ example: 5, test: "value" });
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });

    it("should combine route query parameters and queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute, undefined, { test: "value" });
      await setRouteParams({ example: 5 });
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });
  });

  describe("resolvedModels", () => {
    it("should initially pass empty object to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, models) => ({
        testing: models,
      }));
      setup(childRoute);
      // Do not return resolver, this is testing the default value before subject returns
      interceptRouteData(generatePageInfo());
      spec.detectChanges();
      assertUrlTree("/home", { testing: {} });
    });

    it("should pass empty list of resolved models to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, models) => ({
        testing: models,
      }));
      setup(childRoute);
      await setRouteData(generatePageInfo());
      assertUrlTree("/home", { testing: {} });
    });

    it("should pass single resolved model to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, { model0 }) => ({
        testing: (model0 as MockModel)?.id,
      }));
      setup(childRoute);
      await setRouteData(generatePageInfo({ model: new MockModel({ id: 1 }) }));
      assertUrlTree("/home", { testing: 1 });
    });

    it("should pass multiple resolved models to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        (_, { model0, model1 }) => ({
          testing: (model0 as MockModel)?.id,
          example: (model1 as MockModel)?.id,
        })
      );
      setup(childRoute);
      await setRouteData(
        generatePageInfo(
          { model: new MockModel({ id: 1 }) },
          { model: new MockModel({ id: 5 }) }
        )
      );
      assertUrlTree("/home", { testing: 1, example: 5 });
    });

    it("should pass failed model to queryParams", async () => {
      const error = generateApiErrorDetailsV2();
      const childRoute = StrongRoute.newRoot().add(
        "home",
        (_, { model0, model1 }) => ({
          testing: (model0 as MockModel)?.id,
          example: (model1 as ApiErrorDetails)?.status,
        })
      );
      setup(childRoute);
      await setRouteData(
        generatePageInfo({ model: new MockModel({ id: 1 }) }, { error })
      );
      assertUrlTree("/home", { testing: 1, example: error.status });
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

    it("should create url tree with query parameters from router", async () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ example }) => ({
        testing: example,
      }));
      setup(childRoute);
      await setRouteParams({ example: 5 });
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

    it("should create url tree with with custom and router query parameters", async () => {
      const childRoute = StrongRoute.newRoot().add(
        "home",
        ({ test, example }) => ({
          testing: test,
          testing2: example,
        })
      );
      setup(childRoute, undefined, { test: "value" });
      await setRouteParams({ example: 5 });
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });
  });
});
