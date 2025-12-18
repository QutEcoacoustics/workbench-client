import { Type } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  UrlSegment,
} from "@angular/router";
import {
  shouldNotComplete,
  shouldNotFail,
} from "@baw-api/baw-api.service.spec";
import { homeCategory, homeMenuItem } from "@components/home/home.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  ActivatedRouteStub,
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { generatePageInfo } from "@test/fakes/PageInfo";
import { Observable, Subject } from "rxjs";
import { SharedActivatedRouteService } from "./shared-activated-route.service";

type RouteOptions = any;

describe("SharedActivatedRouteService", () => {
  let routerEvents: Subject<RouterEvent>;
  let spec: SpectatorService<SharedActivatedRouteService>;
  const createService = createServiceFactory(SharedActivatedRouteService);

  function setup(route: ActivatedRouteStub = createActivatedRoute()) {
    routerEvents = new Subject<RouterEvent>();
    spec = createService({
      providers: [
        mockProvider(Router, { events: routerEvents }),
        { provide: ActivatedRoute, useValue: route },
      ],
    });
  }

  function setRootChildren(
    route: ActivatedRouteStub,
    children: ActivatedRouteStub[]
  ) {
    spyOnProperty(route, "root").and.callFake(() =>
      createActivatedRoute({}, { children })
    );
  }

  function createPageActivatedRoute(overrides?: RouteOptions) {
    return createActivatedRoute(
      { component: createPageComponent() },
      overrides
    );
  }

  function createActivatedRoute(
    options: {
      outlet?: string;
      component?: Type<any>;
    } = {},
    overrides: RouteOptions = {}
  ): ActivatedRouteStub {
    // Activated route stubs have infinite depth of children, so force them to 0 if none specified
    const route = new ActivatedRouteStub({
      ...overrides,
      children: overrides.children ?? [],
    });
    if (options.component) {
      route.component = options.component;
      route.outlet = options.outlet ?? "primary";
    }
    return route;
  }

  function createPageComponent(
    ...infos: Partial<IPageInfo>[]
  ): typeof PageComponent {
    class MockPageComponent extends PageComponent {}
    infos.forEach((info) =>
      MockPageComponent.linkToRoute({
        category: homeCategory,
        fullscreen: false,
        menus: {},
        pageRoute: homeMenuItem,
        resolvers: {},
        ...info,
      })
    );
    return MockPageComponent;
  }

  function triggerRouterEvent() {
    routerEvents.next(new NavigationEnd(1, "/url", "/url"));
  }

  describe("activatedRoute", () => {
    function assertActivatedRoutes(
      done: DoneFn,
      ...routes: ActivatedRouteStub[]
    ) {
      let count = 0;
      spec.service.activatedRoute.subscribe({
        next: (route) => {
          expect(route).toEqual(routes[count]);
          count++;
          if (count === routes.length) {
            done();
          }
        },
        error: shouldNotFail,
        complete: shouldNotComplete,
      });
    }

    it("should have initial value", (done) => {
      const routeStub = createActivatedRoute();
      setup(routeStub);
      assertActivatedRoutes(done, routeStub);
    });

    it("should update with activated route of page component", (done) => {
      const routeStub = createActivatedRoute();
      const pageRouteStub = createPageActivatedRoute();
      setup(routeStub);
      setRootChildren(routeStub, [pageRouteStub]);
      assertActivatedRoutes(done, routeStub, pageRouteStub);
      triggerRouterEvent();
    });

    it("should update with activated route of page component when multiple children exist", (done) => {
      const routeStub = createActivatedRoute();
      const pageRouteStub = createPageActivatedRoute();
      setup(routeStub);
      setRootChildren(routeStub, [
        createActivatedRoute(),
        pageRouteStub,
        createActivatedRoute(),
      ]);
      assertActivatedRoutes(done, routeStub, pageRouteStub);
      triggerRouterEvent();
    });

    // TODO Unsure how to test
    xit("should filter by primary outlet", () => {});

    xit("should filter by page component", () => {});
  });

  describe("url", () => {
    validateObservableProperty("url", () => spec.service.url, [
      [new UrlSegment("/first", {})],
      [new UrlSegment("/second", {})],
    ]);
  });

  describe("params", () => {
    validateObservableProperty("params", () => spec.service.params, [
      { projectId: 1 },
      { regionId: 2 },
    ]);
  });

  describe("queryParams", () => {
    validateObservableProperty("queryParams", () => spec.service.queryParams, [
      { projectId: 1 },
      { regionId: 2 },
    ]);
  });

  describe("fragment", () => {
    validateObservableProperty("fragment", () => spec.service.fragment, [
      "/first",
      "/second",
    ]);
  });

  describe("data", () => {
    validateObservableProperty("data", () => spec.service.data, [
      { ping: "pong" },
      { whatIsLife: 42 },
    ]);
  });

  describe("pageInfo", () => {
    validateObservableProperty("data", () => spec.service.pageInfo, [
      generatePageInfo(),
      generatePageInfo(),
    ]);

    it("should not output if data does not contain page info", (done) => {
      const initialComponent = class MockComponent {};
      const pageComponent = createPageComponent();
      const pageData = generatePageInfo();
      const routeStub = createActivatedRoute({ component: initialComponent });
      const pageRouteStub = createActivatedRoute(
        { component: pageComponent },
        { data: pageData }
      );
      setup(routeStub);
      setRootChildren(routeStub, [pageRouteStub]);
      // Should skip data from initial component as it is not page data
      assertProperty(done, spec.service.pageInfo, pageData);
      triggerRouterEvent();
    });
  });

  describe("component", () => {
    it("should have initial value", (done) => {
      const component = class MockComponent {};
      const routeStub = createActivatedRoute({ component });
      setup(routeStub);
      assertProperty(done, spec.service.component, component);
    });

    it("should update with subsequent values of current route", (done) => {
      const initialComponent = class MockComponent {};
      const pageComponent = createPageComponent();
      const routeStub = createActivatedRoute({ component: initialComponent });
      const pageRouteStub = createActivatedRoute({ component: pageComponent });
      setup(routeStub);
      setRootChildren(routeStub, [pageRouteStub]);
      assertProperty(
        done,
        spec.service.component,
        initialComponent,
        pageComponent
      );
      triggerRouterEvent();
    });
  });

  describe("snapshot", () => {
    it("should have initial value", (done) => {
      const routeStub = createActivatedRoute();
      setup(routeStub);
      assertProperty(done, spec.service.snapshot, routeStub.snapshot);
    });

    it("should update with subsequent values of current route", (done) => {
      const routeStub = createActivatedRoute();
      const pageRouteStub = createPageActivatedRoute();
      setup(routeStub);
      setRootChildren(routeStub, [pageRouteStub]);
      assertProperty(
        done,
        spec.service.snapshot,
        routeStub.snapshot,
        pageRouteStub.snapshot
      );
      triggerRouterEvent();
    });
  });

  function assertProperty<T>(
    done: DoneFn,
    property: Observable<T>,
    ...values: T[]
  ) {
    let count = 0;
    property.subscribe({
      next: (value) => {
        expect(value).toEqual(values[count]);
        count++;
        if (count === values.length) {
          done();
        }
      },
      error: shouldNotFail,
      complete: shouldNotComplete,
    });
  }

  function validateObservableProperty<T>(
    routeOption: keyof RouteOptions,
    property: () => Observable<T>,
    values: [T, T]
  ) {
    it("should have initial value", (done) => {
      const routeStub = createActivatedRoute({}, { [routeOption]: values[0] });
      setup(routeStub);
      assertProperty(done, property(), values[0]);
    });

    it("should update with subsequent values of current route", (done) => {
      const routeStub = createActivatedRoute({}, { [routeOption]: values[0] });
      const pageRouteStub = createPageActivatedRoute({
        [routeOption]: values[1],
      });
      setup(routeStub);
      setRootChildren(routeStub, [pageRouteStub]);
      assertProperty(done, property(), values[0], values[1]);
      triggerRouterEvent();
    });
  }
});
