import { Location } from "@angular/common";
import { Component, Input, NgZone, Type } from "@angular/core";
import { Params, Route, Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { PageComponent } from "@helpers/page/pageComponent";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { RouteParams, StrongRoute } from "./strongRoute";

@Component({
  selector: "baw-dummy",
  template: '<a [routerLink]="link" [queryParams]="params"></a>',
})
class DummyComponent {
  @Input() public link: string | string[];
  @Input() public params?: Params | null;
}

@Component({ selector: "baw-other", template: "" })
class OtherComponent {}

describe("StrongRoute", () => {
  let baseRoute: StrongRoute;
  let location: Location;
  let ngZone: NgZone;
  let spec: SpectatorRouting<DummyComponent>;
  const createComponent = createRoutingFactory({
    component: DummyComponent,
    declarations: [OtherComponent],
    imports: [RouterTestingModule],
    stubsEnabled: false,
    routes: [
      { path: "", component: DummyComponent },
      { path: ":id", component: OtherComponent },
      {
        path: "home",
        component: OtherComponent,
        children: [
          { path: "house", component: OtherComponent },
          {
            path: ":id",
            component: OtherComponent,
            children: [{ path: "house", component: OtherComponent }],
          },
        ],
      },
    ],
  });

  function assertChildren(route: StrongRoute, children: StrongRoute[]) {
    expect(route["children"]).toEqual(children);
  }

  function urlTree(commands: string | string[]) {
    return spec.router.createUrlTree(
      Array.isArray(commands) ? commands : [commands]
    );
  }

  async function navigate(route: string | string[]) {
    await ngZone.run(
      async () => await spec.router.navigateByUrl(urlTree(route))
    );
  }

  function setup(link?: string | string[], params?: Params | null) {
    spec = createComponent({ props: { link, params } });
    location = spec.inject(Location);
    ngZone = spec.inject(NgZone);
  }

  beforeEach(() => (baseRoute = StrongRoute.newRoot()));

  describe("pathFragment", () => {
    it("should error if pathFragment begins with a /", () => {
      expect(function () {
        StrongRoute.newRoot().add("/home");
      }).toThrowError();
    });

    it("should not error if pathFragment contains a /", () => {
      expect(function () {
        StrongRoute.newRoot().add("home/house");
      }).not.toThrowError();
    });
  });

  describe("angularRouteConfig", () => {
    it("should set pathMatch to full", () => {
      expect(
        StrongRoute.newRoot().add("home").angularRouteConfig
      ).toHaveAttribute("pathMatch", "full");
    });

    it("should set path", () => {
      expect(
        StrongRoute.newRoot().add("home").angularRouteConfig
      ).toHaveAttribute("path", "home");
    });

    it("should not set path with query parameters", () => {
      expect(
        StrongRoute.newRoot().add("home", () => ({ test: "value" }))
          .angularRouteConfig
      ).toHaveAttribute("path", "home");
    });

    it("should not set path with route parameters set", () => {
      expect(
        StrongRoute.newRoot().add(":id").angularRouteConfig
      ).toHaveAttribute("path", ":id");
    });

    it("should allow custom config values", () => {
      expect(
        StrongRoute.newRoot().add("home", undefined, { outlet: "custom" })
          .angularRouteConfig
      ).toHaveAttribute("outlet", "custom");
    });
  });

  [
    {
      method: "toString",
      leadingChar: "/",
      routeParams: undefined,
      queryParams: undefined,
      outputQsp: true,
    },
    {
      method: "toRouteCompilePath",
      leadingChar: "",
      routeParams: undefined,
      queryParams: undefined,
      outputQsp: false,
    },
    {
      method: "toRouterLink",
      leadingChar: "/",
      routeParams: { id: 5 },
      queryParams: undefined,
      outputQsp: false,
    },
    {
      method: "format",
      leadingChar: "/",
      routeParams: { id: 5 },
      queryParams: { test: "value", example: 5, property: "working" },
      outputQsp: true,
    },
  ].forEach(({ method, leadingChar, routeParams, queryParams, outputQsp }) => {
    describe(method, () => {
      let output: { id: any; test: any; example: any; property: any };

      function assertMethod(
        route: StrongRoute,
        _routeParams: RouteParams,
        _queryParams: Params,
        expectation: string
      ) {
        expect(route[method](_routeParams, _queryParams)).toBe(expectation);
      }

      beforeEach(() => {
        output = {
          id: ":id",
          test: ":value0",
          example: ":value1",
          property: ":value2",
          ...routeParams,
          ...queryParams,
        };
      });

      it("should handle base StrongRoute", () => {
        assertMethod(baseRoute, undefined, undefined, leadingChar);
      });

      it("should handle root route", () => {
        const route = baseRoute.add("");
        assertMethod(route, undefined, undefined, leadingChar);
      });

      it("should handle child route", () => {
        const route = baseRoute.add("home");
        assertMethod(route, undefined, undefined, leadingChar + "home");
      });

      it("should handle parameter route", () => {
        const route = baseRoute.add(":id");
        assertMethod(route, routeParams, undefined, leadingChar + output.id);
      });

      it("should handle grandchild route", () => {
        const route = baseRoute.add("home").add("house");
        assertMethod(route, undefined, undefined, leadingChar + "home/house");
      });

      it("should handle mixed routes", () => {
        const route = baseRoute.add("home").add(":id").add("house");
        assertMethod(
          route,
          routeParams,
          undefined,
          leadingChar + "home/" + output.id + "/house"
        );
      });

      it("should handle query parameter", () => {
        const route = baseRoute.add("home", () => ({ test: output.test }));
        const expectation =
          leadingChar + (outputQsp ? "home?test=" + output.test : "home");
        assertMethod(route, undefined, queryParams, expectation);
      });

      it("should handle multiple query parameters", () => {
        const route = baseRoute.add("home", () => ({
          test: output.test,
          example: output.example,
          property: output.property,
        }));
        const expectation =
          leadingChar +
          (outputQsp
            ? "home?test=" +
              output.test +
              "&example=" +
              output.example +
              "&property=" +
              output.property
            : "home");
        assertMethod(route, undefined, queryParams, expectation);
      });
    });
  });

  describe("toRouterLink", () => {
    it("should throw error if number of params is less than the expected number of params", () => {
      expect(function () {
        StrongRoute.newRoot().add(":id").toRouterLink();
      }).toThrowError();
    });

    it("should throw error if parameter is missing", () => {
      expect(function () {
        StrongRoute.newRoot().add(":id").toRouterLink({ siteId: 5 });
      }).toThrowError();
    });

    it("should not throw error if number of params is more than the expected number of params", () => {
      expect(function () {
        StrongRoute.newRoot().add(":id").toRouterLink({ id: 5, siteId: 10 });
      }).not.toThrowError();
    });
  });

  describe("format", () => {
    it("should filter undefined query params", () => {
      const qsp = { test: 5, example: "value", property: undefined };
      const route = baseRoute.add("home", () => qsp);
      expect(route.format(undefined, qsp)).toBe("/home?test=5&example=value");
    });

    it("should remove ? if all query params are undefined", () => {
      const qsp = { test: undefined, example: undefined, property: undefined };
      const route = baseRoute.add("home", () => qsp);
      expect(route.format(undefined, qsp)).toBe("/home");
    });

    it("should supply params to queryParams", (done) => {
      const qsp = { test: 5, example: "value" };
      const route = baseRoute.add("home", (params) => {
        expect(params).toEqual(qsp);
        done();
        return {};
      });
      route.format(undefined, qsp);
    });
  });

  describe("Router navigation", () => {
    beforeEach(() => setup());

    it("should handle base StrongRoute", async () => {
      await navigate(baseRoute.toRouterLink());
      expect(location.path()).toBe("/");
    });

    it("should handle root route", async () => {
      const childRoute = baseRoute.add("");
      await navigate(childRoute.toRouterLink());
      expect(location.path()).toBe("/");
    });

    it("should handle child route", async () => {
      const childRoute = baseRoute.add("home");
      await navigate(childRoute.toRouterLink());
      expect(location.path()).toBe("/home");
    });

    it("should handle grandchild route", async () => {
      const grandChildRoute = baseRoute.add("home").add("house");
      await navigate(grandChildRoute.toRouterLink());
      expect(location.path()).toBe("/home/house");
    });

    it("should handle mixed routes", async () => {
      const id = modelData.id();
      const grandChildRoute = baseRoute.add("home").add(":id").add("house");
      await navigate(grandChildRoute.toRouterLink({ id }));
      expect(location.path()).toBe(`/home/${id}/house`);
    });

    it("should handle parameter route", async () => {
      const id = modelData.id();
      const childRoute = baseRoute.add(":id");
      await navigate(childRoute.toRouterLink({ id }));
      expect(location.path()).toBe(`/${id}`);
    });

    it("should handle navigating between different route chains", async () => {
      const id = modelData.id();
      const initialRoute = baseRoute.add("home").add(":id").add("house");
      const finalRoute = baseRoute.add(":id");

      await navigate(initialRoute.toRouterLink({ id }));
      expect(location.path()).toBe(`/home/${id}/house`);

      await navigate(finalRoute.toRouterLink({ id }));
      expect(location.path()).toBe(`/${id}`);
    });
  });

  ["add", "addFeatureModule"].forEach((test) => {
    describe(test + " RouterLink", () => {
      it("should navigate to location", async () => {
        const childRoute = baseRoute[test]("home");
        setup(childRoute.toRouterLink());
        expect(location.path()).toBe("");

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe("/home");
      });

      it("should handle navigating between different route chains", async () => {
        const id = modelData.id();
        const initialRoute = baseRoute[test]("home").add(":id").add("house");
        const finalRoute = baseRoute[test](":id");
        setup(finalRoute.toRouterLink({ id }));

        await navigate(initialRoute.toRouterLink({ id }));
        expect(location.path()).toBe(`/home/${id}/house`);

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe(`/${id}`);
      });

      it("should navigate to location with query parameter", async () => {
        const childRoute = baseRoute[test]("home", ({ siteId }) => ({
          siteId,
        }));
        setup(childRoute.toRouterLink(), childRoute.queryParams({ siteId: 5 }));
        expect(location.path()).toBe("");

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe("/home?siteId=5");
      });

      it("should navigate to location with multiple query parameters", async () => {
        const childRoute = baseRoute[test]("home", ({ siteId, projectId }) => ({
          siteId,
          projectId,
        }));
        setup(
          childRoute.toRouterLink(),
          childRoute.queryParams({ siteId: 5, projectId: 10 })
        );
        expect(location.path()).toBe("");

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe("/home?siteId=5&projectId=10");
      });
    });
  });

  [
    {
      title: "Base Route",
      parent: () => StrongRoute.newRoot(),
    },
    {
      title: "Child Route",
      parent: () => StrongRoute.newRoot().add("parent"),
    },
    {
      title: "Feature Module Route",
      parent: () =>
        StrongRoute.newRoot().add("test").addFeatureModule("testing"),
    },
  ].forEach((parent) => {
    let parentRoute: StrongRoute;

    describe(parent.title, () => {
      beforeEach(() => (parentRoute = parent.parent()));

      it("should create base route", () => {
        expect(parentRoute).toBeTruthy();
        assertChildren(parentRoute, []);
      });

      it("should add route", () => {
        const homeRoute = parentRoute.add("home");
        assertChildren(parentRoute, [homeRoute]);
      });

      it("should add multiple routes", () => {
        const homeRoute = parentRoute.add("home");
        const houseRoute = parentRoute.add("house");
        assertChildren(parentRoute, [homeRoute, houseRoute]);
      });

      it("should add parameter route", () => {
        const paramRoute = parentRoute.add(":id");
        assertChildren(parentRoute, [paramRoute]);
      });

      it("should add mixed routes", () => {
        const homeRoute = parentRoute.add("home");
        const paramRoute = parentRoute.add(":id");
        assertChildren(parentRoute, [homeRoute, paramRoute]);
      });
    });
  });

  describe("Compile Routes", () => {
    function createRoute(
      path: string,
      component?: any,
      config: Partial<Route> = {}
    ): Route {
      return {
        path,
        pathMatch: "full",
        children: [{ path: "", component }],
        ...config,
      };
    }

    it("should compile base (StrongRoute.newRoute()) route", () => {
      const routes = [
        createRoute("", MockComponent),
        createRoute("home", MockComponent),
        createRoute("house", MockComponent),
      ];
      const rootRoute = StrongRoute.newRoot();
      rootRoute.add("home").pageComponent = MockComponent;
      rootRoute.add("").pageComponent = MockComponent;
      rootRoute.add("house").pageComponent = MockComponent;

      // Compile from the base StrongRoute
      const compiledRoutes = rootRoute.compileRoutes(callback);
      expect(compiledRoutes).toEqual(routes);
    });

    it('should compile index ("") route', () => {
      const routes = [createRoute("", MockComponent)];
      const rootRoute = StrongRoute.newRoot();
      const indexRoute = rootRoute.add("");
      indexRoute.pageComponent = MockComponent;

      // Compile from the child StrongRoute
      const compiledRoutes = indexRoute.compileRoutes(callback);
      expect(compiledRoutes).toEqual(routes);
    });

    const parents = [
      {
        title: "Base Route",
        baseRef: "test/",
        parent: () => StrongRoute.newRoot().add("test"),
      },
      {
        title: "Feature Module Route",
        baseRef: "test/testing/",
        parent: () =>
          StrongRoute.newRoot().add("test").addFeatureModule("testing"),
      },
    ];

    class MockComponent extends PageComponent {}

    function callback(component: Type<any>, config: Partial<Route>) {
      return { ...config, children: [{ path: "", component }] } as Route;
    }

    parents.forEach((parent) => {
      describe(parent.title, () => {
        let strongRoute: StrongRoute;
        let rootRoute: Route;

        beforeEach(() => {
          strongRoute = parent.parent();

          const path =
            parent.baseRef.length > 0
              ? parent.baseRef.substr(0, parent.baseRef.length - 1)
              : "";
          rootRoute = createRoute(path);
        });

        it("should compile base route", () => {
          rootRoute.children[0].component = MockComponent;
          const routes: Routes = [rootRoute];
          strongRoute.pageComponent = MockComponent;

          const compiledRoutes = strongRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with route", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + "home", MockComponent),
          ];
          const homeRoute = strongRoute.add("home");
          homeRoute.pageComponent = MockComponent;

          const compiledRoutes = homeRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with parameter route", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + ":id", MockComponent),
          ];
          const paramRoute = strongRoute.add(":id");
          paramRoute.pageComponent = MockComponent;

          const compiledRoutes = paramRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with mixed routes", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + "home"),
            createRoute(parent.baseRef + "home/:id"),
            createRoute(parent.baseRef + "home/:id/house", MockComponent),
          ];
          const paramRoute = strongRoute.add("home").add(":id").add("house");
          paramRoute.pageComponent = MockComponent;

          const compiledRoutes = paramRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with custom config", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + ":id", MockComponent, {
              redirectTo: "/test",
            }),
          ];
          const paramRoute = strongRoute.add(":id", undefined, {
            redirectTo: "/test",
          });
          paramRoute.pageComponent = MockComponent;

          const compiledRoutes = paramRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should order child StrongRoute routes", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + "house"),
            createRoute(parent.baseRef + "home"),
            createRoute(parent.baseRef + "home/house"),
            createRoute(parent.baseRef + "home/:id"),
          ];
          strongRoute.add("house");
          const homeRoute = strongRoute.add("home");
          homeRoute.add(":id");
          homeRoute.add("house");

          const compiledRoutes = strongRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should order base StrongRoute routes", () => {
          const routes = [
            rootRoute,
            createRoute(parent.baseRef + "home"),
            createRoute(parent.baseRef + "house"),
            createRoute(parent.baseRef + ":id"),
          ];

          strongRoute.add("home");
          strongRoute.add(":id");
          strongRoute.add("house");

          const compiledRoutes = strongRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });
      });
    });
  });
});
