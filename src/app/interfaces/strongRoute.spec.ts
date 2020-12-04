import { Location } from "@angular/common";
import { Component, Input, NgZone, Type } from "@angular/core";
import { Params, Route, Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { KeysOfType } from "@helpers/advancedTypes";
import { PageComponent } from "@helpers/page/pageComponent";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { StrongRoute } from "./strongRoute";

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

  beforeEach(() => (baseRoute = StrongRoute.base));

  type ToOutput = KeysOfType<StrongRoute, () => string | string[]>;
  (["toString", "toRoute"] as ToOutput[]).forEach((funcName) => {
    function setup(link?: string | string[], params?: Params | null) {
      spec = createComponent({ props: { link, params } });
      location = spec.inject(Location);
      ngZone = spec.inject(NgZone);
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

    describe(`${funcName} Router`, () => {
      beforeEach(() => setup());

      it("should handle base StrongRoute", async () => {
        await navigate(baseRoute[funcName]());
        expect(location.path()).toBe("/");
      });

      it("should handle root route", async () => {
        const childRoute = baseRoute.add("");
        await navigate(childRoute[funcName]());
        expect(location.path()).toBe("/");
      });

      it("should handle child route", async () => {
        const childRoute = baseRoute.add("home");
        await navigate(childRoute[funcName]());
        expect(location.path()).toBe("/home");
      });

      it("should handle grandchild route", async () => {
        const grandChildRoute = baseRoute.add("home").add("house");
        await navigate(grandChildRoute[funcName]());
        expect(location.path()).toBe("/home/house");
      });

      it("should handle mixed routes", async () => {
        const grandChildRoute = baseRoute.add("home").add(":id").add("house");
        await navigate(grandChildRoute[funcName]());
        expect(location.path()).toBe("/home/:id/house");
      });

      it("should handle parameter route", async () => {
        const childRoute = baseRoute.add(":id");
        await navigate(childRoute[funcName]());
        expect(location.path()).toBe("/:id");
      });

      it("should handle navigating between different route chains", async () => {
        const initialRoute = baseRoute.add("home").add(":id").add("house");
        const finalRoute = baseRoute.add(":id");

        await navigate(initialRoute[funcName]());
        expect(location.path()).toBe("/home/:id/house");

        await navigate(finalRoute[funcName]());
        expect(location.path()).toBe("/:id");
      });
    });

    describe(`${funcName} RouterLink`, () => {
      it("example testing routerLink", async () => {
        const childRoute = baseRoute.add("home");
        setup(childRoute[funcName]());
        expect(location.path()).toBe("");

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe("/home");
      });

      it("should handle navigating between different route chains", async () => {
        const initialRoute = baseRoute.add("home").add(":id").add("house");
        const finalRoute = baseRoute.add(":id");
        setup(finalRoute[funcName]());

        await navigate(initialRoute[funcName]());
        expect(location.path()).toBe("/home/:id/house");

        spec.click("a");
        await spec.fixture.whenStable();
        expect(location.path()).toBe("/:id");
      });
    });
  });

  function assertChildren(route: StrongRoute, children: StrongRoute[]) {
    expect(route.children).toEqual(children);
  }

  describe("StrongRoutes", () => {
    const parents = [
      {
        title: "Base Route",
        parent: () => StrongRoute.base,
      },
      {
        title: "Child Route",
        parent: () => StrongRoute.base.add("parent"),
      },
      {
        title: "Feature Module Route",
        parent: () => StrongRoute.base.add("test").addFeatureModule("testing"),
      },
    ];

    parents.forEach((parent) => {
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
  });

  describe("Formatting", () => {
    it("should format base route", () => {
      expect(baseRoute.format(undefined)).toBe("");
    });

    it("should format single parameter route", () => {
      const paramRoute = baseRoute.add(":id");
      expect(paramRoute.format({ id: 1 })).toBe("/1");
    });

    it("should format multiple parameter routes", () => {
      const paramRoute = baseRoute.add(":siteId").add(":projectId");
      expect(paramRoute.format({ siteId: 1, projectId: 5 })).toBe("/1/5");
    });

    it("should format mix routes", () => {
      const paramRoute = baseRoute.add("home").add(":id").add("house");
      expect(paramRoute.format({ id: 1 })).toBe("/home/1/house");
    });
  });

  describe("Compile Routes", () => {
    const parents = [
      {
        title: "Base Route",
        baseRef: "",
        parent: () => StrongRoute.base,
      },
      {
        title: "Feature Module Route",
        baseRef: "test/testing/",
        parent: () => StrongRoute.base.add("test").addFeatureModule("testing"),
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

        function createRoute(
          path: string,
          component?: any,
          config: Partial<Route> = {}
        ) {
          return {
            path,
            pathMatch: "full",
            children: [{ path: "", component }],
            ...config,
          };
        }

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
          const routes: Routes = [
            rootRoute,
            createRoute(parent.baseRef + "home", MockComponent),
          ];
          const homeRoute = strongRoute.add("home");
          homeRoute.pageComponent = MockComponent;

          const compiledRoutes = homeRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with parameter route", () => {
          const routes: Routes = [
            rootRoute,
            createRoute(parent.baseRef + ":id", MockComponent),
          ];
          const paramRoute = strongRoute.add(":id");
          paramRoute.pageComponent = MockComponent;

          const compiledRoutes = paramRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with mixed routes", () => {
          const routes: Routes = [
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
          const routes: Routes = [
            rootRoute,
            createRoute(parent.baseRef + ":id", MockComponent, {
              redirectTo: "/test",
            }),
          ];
          const paramRoute = strongRoute.add(":id", { redirectTo: "/test" });
          paramRoute.pageComponent = MockComponent;

          const compiledRoutes = paramRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should order child StrongRoute routes", () => {
          const routes: Routes = [
            rootRoute,
            createRoute(parent.baseRef + "home"),
            createRoute(parent.baseRef + "home/house"),
            createRoute(parent.baseRef + "home/:id"),
          ];
          const homeRoute = strongRoute.add("home");
          homeRoute.add(":id");
          homeRoute.add("house");

          const compiledRoutes = homeRoute.compileRoutes(callback);
          expect(compiledRoutes).toEqual(routes);
        });

        it("should order base StrongRoute routes", () => {
          const routes: Routes = [
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

  // Currently this doesn't appear to be in use
  xdescribe("routeConfig", () => {
    it("should handle child StrongRoute", () => {});
    it("should handle grandchild StrongRoute", () => {});
    it("should handle parameter StrongRoute", () => {});
  });
});
