import { Type } from "@angular/core";
import { Route, Routes } from "@angular/router";

export type RouteConfigCallback = (
  component: Type<any> | null,
  config: Partial<Route>
) => void;

/**
 * Strong Route class. This provides a workaround for issues related to the
 * angular Routes class. This class is utilized by the PageInfo decorator to
 * dynamically create routes for the various page components.
 */
export class StrongRoute {
  private readonly parameters: StrongRoute[];
  private readonly full: StrongRoute[];

  private readonly config: Partial<Route>;
  readonly root: any;
  readonly parent: StrongRoute;
  readonly name: string;
  readonly isParameter: boolean;
  readonly fullRoute: string;
  readonly children: StrongRoute[] = [];
  pageComponent: Type<any> | null;

  /**
   * Constructor
   * @param parent Components parent
   * @param name Route name
   * @param config Additional router configurations
   */
  private constructor(parent: StrongRoute, name: string, config) {
    this.name = name;

    if (parent) {
      this.parent = parent;
      this.root = parent.root;
      this.parent.children.push(this);
      this.isParameter = name.startsWith(":");
    } else {
      this.parent = null;
      this.root = this;
      this.isParameter = false;
    }

    this.config = { path: name, ...config };

    const [full, parameters] = this.rootToHere();
    this.full = full;
    this.parameters = parameters;
    this.fullRoute = full.map(x => x.name).join("/");
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
   * Method used for templating a route with parameters.
   * Use this in a template like so:
   * <a [routerlink]="route.Format({projectId: 1, siteId: 1})" />
   */
  format(args: { [key: string]: string }): string {
    if (!args) {
      // Should only be unit tests which encounter this
      console.error("Route arguments are " + args);
      return this.fullRoute;
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
    const recursiveAdd = (current: StrongRoute): Route => {
      // provide an opportunity to modify the route config just before we
      // generate it.
      callback(current.pageComponent, current.config);
      const thisRoute = current.routeConfig;
      const childRoutes = current.children.map(recursiveAdd);
      // TODO: the order of these arrays may well need to be changed...
      // depends on how nested routes work
      // we want "" to match current
      // but e.g. "sites" to go down a level
      // and not for both to match at same time.
      thisRoute.children = [...(thisRoute.children || []), ...childRoutes];
      return thisRoute;
    };

    return rootRoute.children.map(recursiveAdd);
  }

  /**
   * String representation of the route
   */
  toString(): string {
    return this.fullRoute;
  }

  /**
   * Router representation of the route
   */
  toRoute(): string[] {
    return this.full.map(x => x.name).filter(x => !!x);
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
