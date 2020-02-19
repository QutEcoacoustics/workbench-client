import { Type } from "@angular/core";
import { Route, Routes } from "@angular/router";
import { StrongRoute } from "./strongRoute";

describe("StrongRoute", () => {
  describe("Base StrongRoute", () => {
    let strongRoute: StrongRoute;

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should create base route", () => {
      expect(strongRoute).toBeTruthy();
    });

    it("should add route", () => {
      const homeRoute = strongRoute.add("home");
      expect(homeRoute).toBeTruthy();
    });

    it("should add multiple routes", () => {
      const homeRoute = strongRoute.add("home");
      const houseRoute = strongRoute.add("house");
      expect(homeRoute).toBeTruthy();
      expect(houseRoute).toBeTruthy();
    });

    it("should add parameter route", () => {
      const paramRoute = strongRoute.add(":id");
      expect(paramRoute).toBeTruthy();
    });

    it("should add mixed routes", () => {
      const homeRoute = strongRoute.add("home");
      const paramRoute = strongRoute.add(":id");
      expect(homeRoute).toBeTruthy();
      expect(paramRoute).toBeTruthy();
    });
  });

  describe("Child StrongRoute", () => {
    let childStrongRoute: StrongRoute;

    beforeEach(() => {
      childStrongRoute = StrongRoute.Base.add("parent");
    });

    it("should create base route", () => {
      expect(childStrongRoute).toBeTruthy();
    });

    it("should add route", () => {
      const homeRoute = childStrongRoute.add("home");
      expect(homeRoute).toBeTruthy();
    });

    it("should add multiple routes", () => {
      const homeRoute = childStrongRoute.add("home");
      const houseRoute = childStrongRoute.add("house");
      expect(homeRoute).toBeTruthy();
      expect(houseRoute).toBeTruthy();
    });

    it("should add parameter route", () => {
      const paramRoute = childStrongRoute.add(":id");
      expect(paramRoute).toBeTruthy();
    });

    it("should add mixed routes", () => {
      const homeRoute = childStrongRoute.add("home");
      const paramRoute = childStrongRoute.add(":id");
      expect(homeRoute).toBeTruthy();
      expect(paramRoute).toBeTruthy();
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
      const paramRoute = strongRoute
        .add("home")
        .add(":id")
        .add("house");
      expect(paramRoute.format({ id: 1 })).toBe("/home/1/house");
    });
  });

  describe("Compile Routes", () => {
    let strongRoute: StrongRoute;

    class MockComponent {}

    function callback(component: Type<any>, config: Partial<Route>) {
      Object.assign(config, {
        children: [
          {
            path: "",
            pathMatch: "full",
            component
          }
        ]
      } as Route);
    }

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should compile base route", () => {
      const routes: Routes = [];
      strongRoute.pageComponent = MockComponent;
      const compiledRoutes = strongRoute.compileRoutes(callback);
      expect(compiledRoutes).toEqual(routes);
    });

    it("should compile StrongRoute with route", () => {
      const routes: Routes = [
        {
          path: "home",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: MockComponent
            }
          ]
        }
      ];
      const homeRoute = strongRoute.add("home");
      homeRoute.pageComponent = MockComponent;
      const compiledRoutes = homeRoute.compileRoutes(callback);

      expect(compiledRoutes).toEqual(routes);
    });

    it("should compile StrongRoute with parameter route", () => {
      const routes: Routes = [
        {
          path: ":id",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: MockComponent
            }
          ]
        }
      ];
      const paramRoute = strongRoute.add(":id");
      paramRoute.pageComponent = MockComponent;
      const compiledRoutes = paramRoute.compileRoutes(callback);

      expect(compiledRoutes).toEqual(routes);
    });

    it("should compile StrongRoute with mixed routes", () => {
      const routes: Routes = [
        {
          path: "home",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: undefined
            },
            {
              path: ":id",
              children: [
                {
                  path: "",
                  pathMatch: "full",
                  component: undefined
                },
                {
                  path: "house",
                  children: [
                    {
                      path: "",
                      pathMatch: "full",
                      component: MockComponent
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      const paramRoute = strongRoute
        .add("home")
        .add(":id")
        .add("house");
      paramRoute.pageComponent = MockComponent;
      const compiledRoutes = paramRoute.compileRoutes(callback);

      expect(compiledRoutes).toEqual(routes);
    });

    it("should order child StrongRoute routes", () => {
      const routes: Routes = [
        {
          path: "home",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: undefined
            },
            {
              path: "house",
              children: [
                {
                  path: "",
                  pathMatch: "full",
                  component: undefined
                }
              ]
            },
            {
              path: ":id",
              children: [
                {
                  path: "",
                  pathMatch: "full",
                  component: undefined
                }
              ]
            }
          ]
        }
      ];
      const homeRoute = strongRoute.add("home");
      homeRoute.add(":id");
      homeRoute.add("house");
      const compiledRoutes = homeRoute.compileRoutes(callback);

      expect(compiledRoutes).toEqual(routes);
    });

    it("should order base StrongRoute routes", () => {
      const routes: Routes = [
        {
          path: "home",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: undefined
            }
          ]
        },
        {
          path: "house",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: undefined
            }
          ]
        },
        {
          path: ":id",
          children: [
            {
              path: "",
              pathMatch: "full",
              component: undefined
            }
          ]
        }
      ];

      strongRoute.add("home");
      strongRoute.add(":id");
      strongRoute.add("house");
      const compiledRoutes = strongRoute.compileRoutes(callback);

      expect(compiledRoutes).toEqual(routes);
    });
  });

  describe("toString", () => {
    let strongRoute: StrongRoute;

    beforeEach(() => {
      strongRoute = StrongRoute.Base;
    });

    it("should handle base StrongRoute", () => {
      expect(strongRoute.toString()).toBe("");
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
      const grandChildRoute = strongRoute
        .add("home")
        .add(":id")
        .add("house");
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

    it("should handle base StrongRoute", () => {
      expect(strongRoute.toRoute()).toEqual([""]);
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
      const grandChildRoute = strongRoute
        .add("home")
        .add(":id")
        .add("house");
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
