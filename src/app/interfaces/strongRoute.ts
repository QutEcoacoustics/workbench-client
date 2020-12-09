import { Type } from "@angular/core";
import { Params, Route, Routes } from "@angular/router";
import { Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";

export type RouteConfigCallback = (
  component: Option<Type<PageComponent>>,
  config: Partial<Route>
) => Route;

type QSP = (params: Params) => Params;

/**
 * Strong Route class. This provides a workaround for issues related to the
 * angular Routes class. This class is utilized by the PageInfo decorator to
 * dynamically create routes for the various page components.
 */
export class StrongRoute {
  private static readonly rootPath = "";

  /** Page component associated with this strong route */
  public pageComponent: Option<Type<PageComponent>>;
  /** Root strong route of this strong route */
  public readonly root: StrongRoute;
  /** Parent strong route of this strong route */
  public readonly parent?: StrongRoute;
  /** Route path/name to add/create in the strong route tree */
  public readonly name?: string;
  /** Route query parameters */
  private readonly qsp?: QSP;
  /** Is this strong route a parameter (ie. :siteId) */
  private readonly isParameter: boolean;
  /** Children strong routes of this strong route */
  private readonly children: StrongRoute[] = [];
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
   * @param name Route name (do not include '/')
   * @param config Additional router configurations
   * @param isRoot Is this a root StrongRoute
   */
  private constructor(
    parent: StrongRoute = undefined,
    name: string = StrongRoute.rootPath,
    qsp: QSP = () => ({}),
    config: Partial<Route> = {},
    isRoot?: boolean
  ) {
    this.root = this;
    this.name = name;
    this.qsp = qsp;
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
    this.config = {
      // Remove initial '/' from route path
      path: this.toString().substr(1),
      pathMatch: "full",
      ...config,
    };
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
   * @param qsp Route query parameters
   * @param config Additional router configurations
   */
  public add(name: string, qsp?: QSP, config?: Partial<Route>) {
    return new StrongRoute(this, name, qsp, config);
  }

  /**
   * Add a new feature module route (inherit parent path without recalculating parent routes)
   *
   * @param name Route name
   * @param qsp Route query parameters
   * @param config Additional router configurations
   */
  public addFeatureModule(name: string, qsp?: QSP, config?: Partial<Route>) {
    return new StrongRoute(this, name, qsp, config, true);
  }

  /**
   * Method used for templating a route with parameters.
   * Use this in a template like so:
   * <a [routerlink]="route.format({projectId: 1, siteId: 1})" />
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
      // Root route wins
      if (a.path === StrongRoute.rootPath || b.path === StrongRoute.rootPath) {
        return a.path === StrongRoute.rootPath ? -1 : 1;
      }

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

      // Ignore root route with no component
      if (
        route &&
        !(
          route.path === StrongRoute.rootPath &&
          route.children[0].component === undefined
        )
      ) {
        output.push(route);
      }
    };

    recursiveAdd(rootRoute);
    return output.sort(sortRoutes);
  }

  /**
   * String representation of the route
   *
   * Example output: "/home/house"
   */
  public toString(): string {
    // Prevent double '/' at start of route string
    const path = this.toRoute().join("/");
    return path.length >= 2 ? path.substr(1) : path;
  }

  /**
   * Router representation of the route inserted into the
   * [routerLink] directive
   *
   * Example output: ["/", "home", "house"]
   */
  public toRoute(): string[] {
    if (this.full.length > 0) {
      const fullRoute = this.full
        .map((x) => x.name)
        .filter((fragment) => !!fragment);

      return ["/", ...fullRoute];
    }

    return ["/"];
  }

  /**
   * Query parameters which should be supplied with this route
   * and should be inserted into the [queryParams] directive
   *
   * @param params Route data parameters
   */
  public queryParams(params: Params) {
    return this.qsp(params);
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
