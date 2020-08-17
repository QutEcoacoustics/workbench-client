import { Type } from "@angular/core";
import { Route, Routes } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { StrongRoute } from "./strongRoute";

describe("StrongRoute", () => {
  function assertChildren(route: StrongRoute, children: StrongRoute[]) {
    expect(route.children).toEqual(children);
  }

  describe("StrongRoutes", () => {
    const parents = [
      {
        title: "Base Route",
        parent: () => StrongRoute.Base,
      },
      {
        title: "Child Route",
        parent: () => StrongRoute.Base.add("parent"),
      },
      {
        title: "Feature Module Route",
        parent: () => StrongRoute.Base.add("test").addFeatureModule("testing"),
      },
    ];

    parents.forEach((parent) => {
      let parentRoute: StrongRoute;

      describe(parent.title, () => {
        beforeEach(() => {
          parentRoute = parent.parent();
        });

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
    let strongRoute: StrongRoute;

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should format base route", () => {
      expect(strongRoute.format(undefined)).toBe("");
    });

    it("should format single parameter route", () => {
      const paramRoute = strongRoute.add(":id");
      expect(paramRoute.format({ id: 1 })).toBe("/1");
    });

    it("should format multiple parameter routes", () => {
      const paramRoute = strongRoute.add(":siteId").add(":projectId");
      expect(paramRoute.format({ siteId: 1, projectId: 5 })).toBe("/1/5");
    });

    it("should format mix routes", () => {
      const paramRoute = strongRoute.add("home").add(":id").add("house");
      expect(paramRoute.format({ id: 1 })).toBe("/home/1/house");
    });
  });

  describe("Compile Routes", () => {
    const parents = [
      {
        title: "Base Route",
        baseRef: "",
        parent: () => StrongRoute.Base,
      },
      {
        title: "Feature Module Route",
        baseRef: "test/testing/",
        parent: () => StrongRoute.Base.add("test").addFeatureModule("testing"),
      },
    ];

    class MockComponent extends PageComponent {}

    function callback(component: Type<any>, config: Partial<Route>) {
      return {
        ...config,
        children: [
          {
            path: "",
            component,
          },
        ],
      } as Route;
    }

    parents.forEach((parent) => {
      describe(parent.title, () => {
        let strongRoute: StrongRoute;
        let rootRoute: Route;

        beforeEach(() => {
          strongRoute = parent.parent();

          rootRoute = {
            path:
              parent.baseRef.length > 0
                ? parent.baseRef.substr(0, parent.baseRef.length - 1)
                : null,
            pathMatch: "full",
            children: [
              {
                path: "",
                component: undefined,
              },
            ],
          };
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
            {
              path: parent.baseRef + "home",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: MockComponent,
                },
              ],
            },
          ];
          const homeRoute = strongRoute.add("home");
          homeRoute.pageComponent = MockComponent;
          const compiledRoutes = homeRoute.compileRoutes(callback);

          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with parameter route", () => {
          const routes: Routes = [
            rootRoute,
            {
              path: parent.baseRef + ":id",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: MockComponent,
                },
              ],
            },
          ];
          const paramRoute = strongRoute.add(":id");
          paramRoute.pageComponent = MockComponent;
          const compiledRoutes = paramRoute.compileRoutes(callback);

          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with mixed routes", () => {
          const routes: Routes = [
            rootRoute,
            {
              path: parent.baseRef + "home",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + "home/:id",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + "home/:id/house",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: MockComponent,
                },
              ],
            },
          ];
          const paramRoute = strongRoute.add("home").add(":id").add("house");
          paramRoute.pageComponent = MockComponent;
          const compiledRoutes = paramRoute.compileRoutes(callback);

          expect(compiledRoutes).toEqual(routes);
        });

        it("should compile StrongRoute with custom config", () => {
          const routes: Routes = [
            rootRoute,
            {
              path: parent.baseRef + ":id",
              pathMatch: "full",
              redirectTo: "/test",
              children: [
                {
                  path: "",
                  component: MockComponent,
                },
              ],
            },
          ];
          const paramRoute = strongRoute.add(":id", { redirectTo: "/test" });
          paramRoute.pageComponent = MockComponent;
          const compiledRoutes = paramRoute.compileRoutes(callback);

          expect(compiledRoutes).toEqual(routes);
        });

        it("should order child StrongRoute routes", () => {
          const routes: Routes = [
            rootRoute,
            {
              path: parent.baseRef + "home",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + "home/house",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + "home/:id",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
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
            {
              path: parent.baseRef + "home",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + "house",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
            {
              path: parent.baseRef + ":id",
              pathMatch: "full",
              children: [
                {
                  path: "",
                  component: undefined,
                },
              ],
            },
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

  describe("toString", () => {
    let strongRoute: StrongRoute;

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should handle base StrongRoute", () => {
      expect(strongRoute.toString()).toBe("/");
    });

    it("should handle child route", () => {
      const childRoute = strongRoute.add("home");
      expect(childRoute.toString()).toBe("/home");
    });

    it("should handle grandchild route", () => {
      const grandChildRoute = strongRoute.add("home").add("house");
      expect(grandChildRoute.toString()).toBe("/home/house");
    });

    it("should handle mixed routes", () => {
      const grandChildRoute = strongRoute.add("home").add(":id").add("house");
      expect(grandChildRoute.toString()).toBe("/home/:id/house");
    });

    it("should handle parameter route", () => {
      const childRoute = strongRoute.add(":id");
      expect(childRoute.toString()).toBe("/:id");
    });
  });

  describe("toRoute", () => {
    let strongRoute: StrongRoute;

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should handle child route", () => {
      const childRoute = strongRoute.add("home");
      expect(childRoute.toRoute()).toEqual(["home"]);
    });

    it("should handle grandchild route", () => {
      const grandChildRoute = strongRoute.add("home").add("house");
      expect(grandChildRoute.toRoute()).toEqual(["home", "house"]);
    });

    it("should handle mixed routes", () => {
      const grandChildRoute = strongRoute.add("home").add(":id").add("house");
      expect(grandChildRoute.toRoute()).toEqual(["home", ":id", "house"]);
    });

    it("should handle parameter route", () => {
      const childRoute = strongRoute.add(":id");
      expect(childRoute.toRoute()).toEqual([":id"]);
    });
  });

  // Currently this doesn't appear to be in use
  xdescribe("routeConfig", () => {
    it("should handle child StrongRoute", () => {});
    it("should handle grandchild StrongRoute", () => {});
    it("should handle parameter StrongRoute", () => {});
  });
});
