import { Type } from "@angular/core";
import { Route, Routes } from "@angular/router";
import { Potential } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";

export type RouteConfigCallback = (
  component: Potential<Type<PageComponent>>,
  config: Partial<Route>
) => Route;

/**
 * Strong Route class. This provides a workaround for issues related to the
 * angular Routes class. This class is utilized by the PageInfo decorator to
 * dynamically create routes for the various page components.
 */
export class StrongRoute {
  /** Page component associated with this strong route */
  public pageComponent: Potential<Type<PageComponent>>;
  /** Root strong route of this strong route */
  public readonly root: StrongRoute;
  /** Parent strong route of this strong route */
  public readonly parent?: StrongRoute;
  /** Route path/name to add/create in the strong route tree */
  public readonly name?: string;
  /** Is this strong route a parameter (ie. :siteId) */
  public readonly isParameter: boolean;
  /** Full route to this strong route as a string */
  public readonly fullRoute?: string;
  /** Children strong routes of this strong route */
  public readonly children: StrongRoute[] = [];
  /** List of parameter strong routes in this strong routes path */
  private readonly parameters: StrongRoute[];
  /** List of parent strong routes (including current strong route) */
  private readonly full: StrongRoute[];
  /** Additional configuration options to append to this strong route */
  private readonly config: Partial<Route>;

  /**
   * Constructor
   *
   * @param parent Components parent
   * @param name Route name
   * @param config Additional router configurations
   * @param isRoot Is this a root StrongRoute
   */
  private constructor(
    parent?: StrongRoute,
    name?: string,
    config: Partial<Route> = {},
    isRoot?: boolean
  ) {
    this.root = this;
    this.name = name;
    this.isParameter = name ? name.startsWith(":") : false;

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
    }

    this.config = { path: this.fullRoute, pathMatch: "full", ...config };
  }

  /**
   * A base level (root) route component
   */
  public static get base() {
    return new StrongRoute();
  }

  /**
   * Add a child route
   *
   * @param name Route name
   * @param config Additional router configurations
   */
  public add(name: string, config?: Partial<Route>) {
    return new StrongRoute(this, name, config);
  }

  /**
   * Add a new feature module route (inherit parent path without recalculating parent routes)
   *
   * @param name Route name
   * @param config Additional router configurations
   */
  public addFeatureModule(name: string, config?: Partial<Route>) {
    return new StrongRoute(this, name, config, true);
  }

  /**
   * Method used for templating a route with parameters.
   * Use this in a template like so:
   * <a [routerlink]="route.Format({projectId: 1, siteId: 1})" />
   */
  public format(args: { [key: string]: string | number }): string {
    if (!args) {
      // Should only be unit tests which encounter this
      console.error("Route arguments are " + args);
      return "";
    }

    if (Object.keys(args).length < this.parameters.length) {
      const msg = `Got ${
        Object.keys(args).length
      } route arguments but expected ${this.parameters.length}`;
      console.error(msg);
      throw new Error(msg);
    }

    const prepareParam = (x: StrongRoute) => {
      if (x.isParameter) {
        const key = x.name.substr(1, x.name.length - 1);

        if (args.hasOwnProperty(key)) {
          return args[key];
        } else {
          const msg = `Parameter named ${x.name} was not supplied a value and a default value was not given`;
          console.error(msg);
          throw new Error(msg);
        }
      } else {
        return x.name;
      }
    };

    return this.full.map(prepareParam).join("/");
  }

  /**
   * Compile the list of routes for a module
   *
   * @param callback Callback function (usually: getRouteConfigForPage)
   */
  public compileRoutes(callback: RouteConfigCallback): Routes {
    const rootRoute = this.root;
    const output: Routes = [];

    const sortRoutes = (a: Route, b: Route): -1 | 0 | 1 => {
      const aPathExists = isInstantiated(a.path);
      const bPathExists = isInstantiated(b.path);

      if (!aPathExists && !bPathExists) {
        return 0;
      } else if (!aPathExists || !bPathExists) {
        return aPathExists ? 1 : -1;
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
   * TODO Rewrite
   * String representation of the route
   *
   * Example output: "/home/house"
   */
  public toString(): string {
    return "/" + (this.fullRoute ? this.fullRoute : "");
  }

  /**
   * TODO Rewrite
   * Router representation of the route
   * ! This will use a path relative to the current page if directly
   * inserted into the [routerLink] directive
   *
   * Example output: ["home", "house"]
   */
  public toRoute(): string[] {
    return this.full.slice(1).map((x) => x.name);
  }

  /**
   * Route config
   */
  public get routeConfig() {
    return this.config;
  }

  /**
   * Map the routes from the root (base) route to the current route
   */
  private rootToHere(): [StrongRoute[], StrongRoute[]] {
    const fragments = [];
    const parameters = [];
    let current: StrongRoute = this;
    while (isInstantiated(current)) {
      fragments.push(current);
      if (current.isParameter) {
        parameters.push(current);
      }
      current = current.parent;
    }

    return [fragments.reverse(), parameters.reverse()];
  }
}
