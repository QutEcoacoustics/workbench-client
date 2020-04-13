import { Type } from "@angular/core";
import { Route, Routes } from "@angular/router";

export type RouteConfigCallback = (
  component: Type<any> | null,
  config: Partial<Route>
) => Route;

/**
 * Strong Route class. This provides a workaround for issues related to the
 * angular Routes class. This class is utilized by the PageInfo decorator to
 * dynamically create routes for the various page components.
 */
export class StrongRoute {
  public pageComponent: Type<any> | null;
  public readonly root: any;
  public readonly parent: StrongRoute;
  public readonly name: string;
  public readonly isParameter: boolean;
  public readonly fullRoute: string;
  public readonly children: StrongRoute[] = [];
  private readonly parameters: StrongRoute[];
  private readonly full: StrongRoute[];
  private readonly config: Partial<Route>;

  /**
   * Constructor
   * @param parent Components parent
   * @param name Route name
   * @param config Additional router configurations
   * @param isRoot Is this a root StrongRoute
   */
  private constructor(
    parent: StrongRoute,
    name: string,
    config: Partial<Route>,
    isRoot?: boolean
  ) {
    this.root = this;
    this.name = name;
    this.parent = null;
    this.isParameter = this.name ? name.startsWith(":") : false;

    if (parent) {
      this.parent = parent;

      if (!isRoot) {
        this.root = parent.root;
        this.parent.children.push(this);
      }
    }

    const [full, parameters] = this.rootToHere();
    this.full = full;
    this.parameters = parameters;

    if (full.length > 1) {
      this.fullRoute = this.toRoute().join("/");
    } else if (full.length === 1) {
      this.fullRoute = this.name;
    } else {
      this.fullRoute = undefined;
    }

    this.config = { path: this.fullRoute, pathMatch: "full", ...config };
  }

  /**
   * A base level (root) route component
   */
  static get Base() {
    return new StrongRoute(null, null, {});
  }

  /**
   * Add a child route
   * @param name Route name
   * @param config Additional router configurations
   */
  add(name: string, config: Partial<Route> = {}) {
    return new StrongRoute(this, name, config);
  }

  /**
   * Add a new feature module route (inherit parent path without recalculating parent routes)
   * @param name Route name
   * @param config Additional router configurations
   */
  addFeatureModule(name: string, config: Partial<Route> = {}) {
    return new StrongRoute(this, name, config, true);
  }

  /**
   * Method used for templating a route with parameters.
   * Use this in a template like so:
   * <a [routerlink]="route.Format({projectId: 1, siteId: 1})" />
   */
  format(args: { [key: string]: string | number }): string {
    if (!args) {
      // Should only be unit tests which encounter this
      console.error("Route arguments are " + args);
      return "";
    }

    if (Object.keys(args).length < this.parameters.length) {
      throw new Error(
        `Got ${Object.keys(args).length} route arguments but expected ${
          this.parameters.length
        }`
      );
    }

    const prepareParam = (x: StrongRoute) => {
      if (x.isParameter) {
        const key = x.name.substr(1, x.name.length - 1);

        if (args.hasOwnProperty(key)) {
          return args[key];
        } else {
          throw new Error(
            `Parameter named ${x.name} was not supplied a value and a default value was not given`
          );
        }
      } else {
        return x.name;
      }
    };

    return this.full.map(prepareParam).join("/");
  }

  /**
   * Compile the list of routes for a module
   * @param callback Callback function (usually: GetRouteConfigForPage)
   */
  compileRoutes(callback: RouteConfigCallback): Routes {
    const rootRoute = this.root;
    const output: Routes = [];

    const sortRoutes = (a: Route, b: Route): -1 | 0 | 1 => {
      if (a.path === null && b.path === null) {
        return 0;
      } else if (a.path === null || b.path === null) {
        return a.path === null ? -1 : 1;
      }

      const aRoutes = a.path.split("/");
      const bRoutes = b.path.split("/");
      const aParamRoute = aRoutes[aRoutes.length - 1].startsWith(":");
      const bParamRoute = bRoutes[bRoutes.length - 1].startsWith(":");

      // Order routes with less parents with priority
      if (aRoutes.length !== bRoutes.length) {
        return aRoutes.length > bRoutes.length ? 1 : -1;
      }

      // If one of the routes is a parameter route
      if (aParamRoute || bParamRoute) {
        // If both are parameter routes, they are equal
        if (aParamRoute && bParamRoute) {
          return 0;
        }

        // Else give priority to the non-parameter route
        return aParamRoute ? 1 : -1;
      }

      return 0;
    };

    const recursiveAdd = (current: StrongRoute): void => {
      const route = callback(current.pageComponent, current.config);
      current.children.forEach(recursiveAdd);

      if (route) {
        output.push(route);
      }
    };

    recursiveAdd(rootRoute);
    return output.sort(sortRoutes);
  }

  /**
   * String representation of the route
   * eg. "/home/house"
   */
  toString(): string {
    return "/" + (this.fullRoute ? this.fullRoute : "");
  }

  /**
   * Router representation of the route
   * eg. ["home", "house"]
   */
  toRoute(): string[] {
    return this.full.slice(1).map((x) => x.name);
  }

  /**
   * Route config
   */
  get routeConfig() {
    return this.config;
  }

  /**
   * Map the routes from the root (base) route to the current route
   */
  private rootToHere(): [StrongRoute[], StrongRoute[]] {
    const fragments = [];
    const parameters = [];
    let current: StrongRoute = this;
    while (current !== null) {
      fragments.push(current);
      if (current.isParameter) {
        parameters.push(current);
      }
      current = current.parent;
    }

    return [fragments.reverse(), parameters.reverse()];
  }
}
