import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { IPageInfo } from "@helpers/page/pageInfo";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { ActivatedRouteStub, createDirectiveFactory, mockProvider, SpectatorDirective } from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generatePageInfoResolvers } from "@test/helpers/general";
import { BehaviorSubject } from "rxjs";
import { StrongRouteDirective } from "./strong-route.directive";

describe("StrongRouteDirective", () => {
  let activatedRoute$: BehaviorSubject<ActivatedRoute>;
  let router: Router;
  let currentRoute: ActivatedRoute;
  let spec: SpectatorDirective<StrongRouteDirective>;

  const createDirective = createDirectiveFactory({
    directive: StrongRouteDirective,
    imports: [RouterTestingModule],
  });

  const createRouterLink = createDirectiveFactory({
    directive: RouterLink,
    declarations: [StrongRouteDirective],
    imports: [RouterTestingModule],
  });

  function updateSnapshot(opts?: { queryParams?: Params; routeParams?: Params; data?: IPageInfo }) {
    currentRoute = new ActivatedRouteStub({
      params: opts?.routeParams ?? {},
      queryParams: opts?.queryParams ?? {},
      data: opts?.data ?? {},
    });
    activatedRoute$.next(currentRoute);
  }

  function assertUrlTree(url: string, queryParams: Params) {
    const expectedUrlTree = router.createUrlTree([url], {
      queryParams,
      relativeTo: currentRoute,
      fragment: spec.directive.fragment,
      queryParamsHandling: spec.directive.queryParamsHandling,
      preserveFragment: spec.directive.preserveFragment,
    });

    expect(spec.directive.urlTree).toEqual(expectedUrlTree);
  }

  function assertRoute(link: string) {
    const href = spec.query<HTMLAnchorElement>("a").href;
    const url = new URL(href, document.baseURI);
    expect(url.pathname + url.search).toBe(link);
  }

  function setup(strongRoute: StrongRoute, routeParams?: RouteParams, queryParams?: Params): void {
    spec = createDirective(
      `
        <a
          [strongRoute]="strongRoute"
          [routeParams]="routeParams"
          [queryParams]="queryParams"
        >Strong Route Link</a>
    `,
      {
        hostProps: { strongRoute, routeParams, queryParams },
        providers: [
          mockProvider(SharedActivatedRouteService, {
            activatedRoute: activatedRoute$,
          }),
        ],
        detectChanges: false,
      },
    );

    router = spec.inject(Router);

    spec.detectChanges();
  }

  beforeEach(() => {
    currentRoute = new ActivatedRouteStub();
    activatedRoute$ = new BehaviorSubject<ActivatedRoute>(currentRoute);
  });

  it("should not interfere with routerLink if no [strongRoute]", () => {
    const routerLinkSpec = createRouterLink('<a [routerLink]="link" [queryParams]="params"></a>', {
      hostProps: { link: "/home", params: { test: "value" } },
    });
    routerLinkSpec.detectChanges();

    const routerLink = routerLinkSpec.query(RouterLink);
    expect(routerLink).toBeInstanceOf(RouterLink);
    expect(routerLink.href).toContain("/home?test=value");
  });

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

  describe("routeParams input", () => {
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

  describe("queryParams input", () => {
    it("should handle strongRoute with query parameter", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
        test,
      }));
      setup(childRoute, undefined, { test: "value" });
      spec.detectChanges();
      assertRoute("/home?test=value");
    });

    it("should handle strongRoute with multiple query parameter", () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test, example }) => ({ test, example }));
      setup(childRoute, undefined, { example: 5, test: "value" });
      spec.detectChanges();
      assertRoute("/home?test=value&example=5");
    });
  });

  describe("resolvedModels", () => {
    it("should initially pass empty object to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, models) => ({
        testing: models,
      }));
      setup(childRoute);
      spec.detectChanges();
      assertUrlTree("/home", { testing: {} });
    });

    it("should pass empty list of resolved models to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, models) => ({
        testing: models,
      }));
      setup(childRoute);
      updateSnapshot({ data: generatePageInfoResolvers() });
      spec.detectChanges();
      assertUrlTree("/home", { testing: {} });
    });

    it("should pass single resolved model to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, { model0 }) => ({
        testing: (model0 as MockModel)?.id,
      }));
      setup(childRoute);
      updateSnapshot({
        data: generatePageInfoResolvers({ model: new MockModel({ id: 1 }) }),
      });
      spec.detectChanges();
      assertUrlTree("/home", { testing: 1 });
    });

    it("should pass multiple resolved models to queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (_, { model0, model1 }) => ({
        testing: (model0 as MockModel)?.id,
        example: (model1 as MockModel)?.id,
      }));
      setup(childRoute);
      updateSnapshot({
        data: generatePageInfoResolvers({ model: new MockModel({ id: 1 }) }, { model: new MockModel({ id: 5 }) }),
      });
      spec.detectChanges();
      assertUrlTree("/home", { testing: 1, example: 5 });
    });

    it("should pass failed model to queryParams", async () => {
      const error = generateBawApiError();
      const childRoute = StrongRoute.newRoot().add("home", (_, { model0, model1 }) => ({
        testing: (model0 as MockModel)?.id,
        example: (model1 as BawApiError)?.status,
      }));
      setup(childRoute);
      updateSnapshot({
        data: generatePageInfoResolvers({ model: new MockModel({ id: 1 }) }, { error }),
      });
      spec.detectChanges();
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

    describe("route parameters", () => {
      it("should create url tree with router query parameters", async () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ example }) => ({
          testing: example,
        }));
        setup(childRoute);
        updateSnapshot({ routeParams: { example: 5 } });
        spec.detectChanges();
        assertUrlTree("/home", { testing: 5 });
      });

      it("should create url tree with router route parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ example }) => ({
          testing: example,
        }));
        setup(childRoute, { example: 5 });
        spec.detectChanges();
        assertUrlTree("/home", { testing: 5 });
      });

      it("should create url tree with input route parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          testing: test,
        }));
        setup(childRoute, { test: "value" });
        spec.detectChanges();
        assertUrlTree("/home", { testing: "value" });
      });
    });

    describe("query parameters", () => {
      it("should create url tree with custom query parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          testing: test,
        }));
        setup(childRoute, undefined, { test: "value" });
        spec.detectChanges();
        assertUrlTree("/home", { testing: "value" });
      });
    });

    describe("strongRoute", () => {
      it("should handle strongRoute with router query parameter", async () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          testing: test,
        }));
        setup(childRoute);
        updateSnapshot({ routeParams: { test: "value" } });
        spec.detectChanges();
        assertUrlTree("/home", { testing: "value" });
      });

      it("should handle strongRoute with multiple router query parameter", async () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test, example }) => ({
          testing: test,
          testing2: example,
        }));
        setup(childRoute);
        updateSnapshot({ routeParams: { test: "value", example: 5 } });
        spec.detectChanges();
        assertUrlTree("/home", { testing: "value", testing2: 5 });
      });
    });

    it("should combine route query parameters and queryParams", async () => {
      const childRoute = StrongRoute.newRoot().add("home", ({ test, example }) => ({
        testing: test,
        testing2: example,
      }));
      setup(childRoute, undefined, { test: "value" });
      updateSnapshot({ routeParams: { example: 5 } });
      spec.detectChanges();
      assertUrlTree("/home", { testing: "value", testing2: 5 });
    });

    describe("query parameter priority", () => {
      const inputQueryParam = { test: "inputQueryParam" };
      const inputRouteParam = { test: "inputRouteParam" };
      const routerQueryParam = { test: "routerQueryParam" };
      const routerRouteParam = { test: "routerRouteParam" };

      it("should prioritize input query parameters first", async () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          test,
        }));
        setup(childRoute, inputRouteParam, inputQueryParam);
        updateSnapshot({
          routeParams: routerRouteParam,
          queryParams: routerQueryParam,
        });
        spec.detectChanges();
        assertUrlTree("/home", inputQueryParam);
      });

      it("should prioritize input route parameters after input query parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          test,
        }));
        setup(childRoute, inputRouteParam);
        updateSnapshot({
          routeParams: routerRouteParam,
          queryParams: routerQueryParam,
        });
        spec.detectChanges();
        assertUrlTree("/home", inputRouteParam);
      });

      it("should prioritize router query parameters after input route parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          test,
        }));
        setup(childRoute);
        updateSnapshot({
          routeParams: routerRouteParam,
          queryParams: routerQueryParam,
        });
        spec.detectChanges();
        assertUrlTree("/home", routerQueryParam);
      });

      it("should prioritize router route parameters after router query parameters", () => {
        const childRoute = StrongRoute.newRoot().add("home", ({ test }) => ({
          test,
        }));
        setup(childRoute);
        updateSnapshot({ routeParams: routerRouteParam });
        spec.detectChanges();
        assertUrlTree("/home", routerRouteParam);
      });
    });

    it("should create url tree with all possible qsp inputs", async () => {
      const childRoute = StrongRoute.newRoot().add("home", (params) => params);
      setup(childRoute, { inputRouteParams: "value" }, { inputQueryParams: "value" });
      updateSnapshot({
        routeParams: { routerRouteParams: "value" },
        queryParams: { routerQueryParams: "value" },
      });
      spec.detectChanges();
      assertUrlTree("/home", {
        inputRouteParams: "value",
        inputQueryParams: "value",
        routerRouteParams: "value",
        routerQueryParams: "value",
      });
    });
  });
});
