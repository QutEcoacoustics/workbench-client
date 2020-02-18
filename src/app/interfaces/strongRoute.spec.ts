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

  xdescribe("Formatting", () => {
    it("should format base route", () => {});
    it("should format child route", () => {});
    it("should format parameter route", () => {});
    it("should format child parameter route", () => {});
  });

  xdescribe("Compile Routes", () => {
    it("should compile base route with route", () => {});
    it("should compile base route with parameter route", () => {});
    it("should compile base route with mixed routes", () => {});
    it("should compile child StrongRoute with route", () => {});
    it("should compile child StrongRoute with parameter route", () => {});
    it("should compile child StrongRoute with mixed routes", () => {});
    it("should order '\"\"' routes first", () => {});
    it("should order parameter route last", () => {});
  });

  describe("toString", () => {
    it("should handle base StrongRoute", () => {
      const strongRoute = StrongRoute.Base;
      expect(strongRoute.toString()).toBe("");
    });

    it("should handle child route", () => {
      const childRoute = StrongRoute.Base.add("home");
      expect(childRoute.toString()).toBe("/home");
    });

    it("should handle grandchild route", () => {
      const grandChildRoute = StrongRoute.Base.add("home").add("house");
      expect(grandChildRoute.toString()).toBe("/home/house");
    });

    it("should handle mixed routes", () => {
      const grandChildRoute = StrongRoute.Base.add("home")
        .add(":id")
        .add("house");
      expect(grandChildRoute.toString()).toBe("/home/:id/house");
    });

    it("should handle parameter route", () => {
      const childRoute = StrongRoute.Base.add(":id");
      expect(childRoute.toString()).toBe("/:id");
    });
  });

  describe("toRoute", () => {
    it("should handle base StrongRoute", () => {
      const strongRoute = StrongRoute.Base;
      expect(strongRoute.toRoute()).toEqual([""]);
    });

    it("should handle child route", () => {
      const childRoute = StrongRoute.Base.add("home");
      expect(childRoute.toRoute()).toEqual(["home"]);
    });

    it("should handle grandchild route", () => {
      const grandChildRoute = StrongRoute.Base.add("home").add("house");
      expect(grandChildRoute.toRoute()).toEqual(["home", "house"]);
    });

    it("should handle mixed routes", () => {
      const grandChildRoute = StrongRoute.Base.add("home")
        .add(":id")
        .add("house");
      expect(grandChildRoute.toRoute()).toEqual(["home", ":id", "house"]);
    });

    it("should handle parameter route", () => {
      const childRoute = StrongRoute.Base.add(":id");
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
