import { Type } from "@angular/core";
import { Params, Route, Routes } from "@angular/router";
import { Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";

export type RouteConfigCallback = (
  component: Option<Type<PageComponent>>,
  config: Partial<Route>
) => Route;

export type RouteParams = Record<string, string | number>;

type QSPCallback = (params: Params) => Params;

/**
 * Strong Route class. This provides a workaround for issues related to the
 * angular Routes class. This class is utilized by the PageInfo decorator to
 * dynamically create routes for the various page components.
 */
export class StrongRoute {
  private static readonly rootPath = "";
  private static readonly rootRoute = "/";

  /**
   * Page component associated with this strong route. This will be the
   * component which is displayed when the user navigates to the path
   * of this StrongRoute. If no pageComponent is supplied, the StrongRoute
   * will display a page not found error message when navigated to.
   */
  public pageComponent: Option<Type<PageComponent>>;
  /**
   * Root StrongRoute of this StrongRoute, all children of this root
   * StrongRoute will be compiled together
   */
  public readonly root: StrongRoute;
  /**
   * Children StrongRoutes of this StrongRoute. This allows for tracing
   * down the hierarchical tree of StrongRoutes.
   */
  public readonly children: StrongRoute[] = [];
  /**
   * Is this StrongRoute segment a route parameters? (ie. `":siteId"`)
   */
  private readonly isParameter: boolean;

  /**
   * Constructor
   *
   * @param parent
   * Parent StrongRoute of this StrongRoute. This allows for tracing
   * up the hierarchical tree of StrongRoutes, up to the root StrongRoute.
   * @param pathFragment
   * Route path fragment to add to the StrongRoute hierarchical tree
   * (ie `"home"`). The pathFragment does not include a leading `'/'` if it is
   * a root path.
   * @param queryParams
   * Function to produce the query parameters when navigating to the StrongRoute.
   * Example usage:
   * ```html
   * <a
   *  [routerLink]="strongRoute.toRouterLink()"
   *  [queryParams]="strongRoute.qsp({projectId: 5})"
   *  />
   * ```
   * @param angularRouteConfig
   * Additional configuration options to apply to the compiled Route
   * @param isRoot Is this a root StrongRoute
   */
  private constructor(
    public readonly parent?: StrongRoute,
    public readonly pathFragment: string = StrongRoute.rootPath,
    public readonly queryParams: QSPCallback = () => ({}),
    public readonly angularRouteConfig: Partial<Route> = {},
    isRoot?: boolean
  ) {
    // Check pathFragment does not have a leading '/'
    if (pathFragment.startsWith("/")) {
      const msg = "StrongRoute pathFragment should not start with a '/'";
      console.error(msg, this);
      throw Error(msg);
    }

    this.isParameter = pathFragment.startsWith(":");
    this.angularRouteConfig = angularRouteConfig;

    if (parent && !isRoot) {
      this.root = parent.root;
      this.parent.children.push(this);
    } else {
      this.root = this;
    }

    this.angularRouteConfig = {
      path: this.toRouteCompilePath(),
      pathMatch: "full",
      ...angularRouteConfig,
    };
  }

  /**
   * Create a new root StrongRoute
   */
  public static newRoot() {
    return new StrongRoute();
  }

  /**
   * Add a child route
   *
   * @param pathFragment Route path fragment to add to the StrongRoute hierarchical
   * tree (ie `"home"`). The pathFragment does not include a leading `'/'` if it is a
   * root path.
   * @param queryParams Function to produce the query parameters when navigating to
   * the StrongRoute
   * @param angularRouteConfig Additional configuration options to apply to the
   * compiled Route
   */
  public add(
    pathFragment: string,
    queryParams?: QSPCallback,
    angularRouteConfig?: Partial<Route>
  ) {
    return new StrongRoute(this, pathFragment, queryParams, angularRouteConfig);
  }

  /**
   * Add a new feature module route (inherit parent path without recalculating parent routes)
   *
   * @param pathFragment Route path fragment to add to the StrongRoute hierarchical
   * tree (ie `"home"`). The pathFragment does not include a leading `'/'` if it is a
   * root path.
   * @param queryParams Function to produce the query parameters when navigating to
   * the StrongRoute
   * @param angularRouteConfig Additional configuration options to apply to the
   * compiled Route
   */
  public addFeatureModule(
    pathFragment: string,
    queryParams?: QSPCallback,
    angularRouteConfig?: Partial<Route>
  ) {
    return new StrongRoute(
      this,
      pathFragment,
      queryParams,
      angularRouteConfig,
      true
    );
  }

  /**
   * Diagnostic representation of the StrongRoute
   *
   * Example output: `"/projects/:projectId/sites/:siteId?filter_name=:value0"`
   */
  public toString(): string {
    const keys = Object.keys(this.queryParams({}));
    const basePath = StrongRoute.rootRoute + this.toRouteCompilePath();

    if (keys.length === 0) {
      return basePath;
    }

    const qsp = keys.map((key, index) => `${key}=:value${index}`).join("&");
    return `${basePath}?${qsp}`;
  }

  /**
   * Returns a string representation of the StrongRoute which is compatible
   * with the Angular Route module. This should only be used during the
   * compilation of routes.
   *
   * Example output: `"projects/:projectId/sites/:siteId"`
   */
  public toRouteCompilePath(): string {
    const [full] = this.rootToHere();
    if (full.length > 1) {
      return full
        .slice(1)
        .map((x) => x.pathFragment)
        .join("/");
    }

    return full[0].pathFragment;
  }

  /**
   * Returns a string representation of the StrongRoute which is compatible
   * with the RouterLink directive.
   *
   * Example output: `"/projects/5/sites/10"`
   *
   * Example usage:
   * ```html
   * <a
   *  [routerLink]="strongRoute.toRouterLink({projectId: 5, siteId: 10})"
   *  [queryParams]="strongRoute.queryParams()"
   *  />
   * ```
   *
   * @param params Route parameters
   */
  public toRouterLink(params: RouteParams = {}): string {
    const [full, parameters] = this.rootToHere();
    const numArgs = Object.keys(params).length;
    if (numArgs < parameters.length) {
      const msg = `Got ${numArgs} route arguments but expected ${parameters.length}`;
      console.error(msg);
      throw new Error(msg);
    }

    const prepareParam = (x: StrongRoute): string | number => {
      if (x.isParameter) {
        const key = x.pathFragment.substr(1, x.pathFragment.length - 1);

        if (Object.prototype.hasOwnProperty.call(params, key)) {
          return params[key];
        } else {
          const msg = `Parameter named ${x.pathFragment} was not supplied a value and a default value was not given`;
          console.error(msg);
          throw new Error(msg);
        }
      } else {
        return x.pathFragment;
      }
    };

    const route = full.map(prepareParam).join("/");
    return route.startsWith(StrongRoute.rootRoute)
      ? route
      : StrongRoute.rootRoute + route;
  }

  /**
   * Returns a string representation of the StrongRoute which is compatible
   * with default HTML links.
   *
   * Example output: `"/projects/5?filter_name='id'"`
   *
   * Example usage:
   * ```html
   * <a
   *  [href]="strongRoute.format(
   *    {projectId: 5},
   *    {filter_name: 'id'}
   *  )"
   *  />
   * ```
   *
   * @param routeParams Route parameters
   * @param queryParams Query parameters
   */
  public format(
    routeParams: RouteParams = {},
    queryParams: Params = {}
  ): string {
    const qsp = this.queryParams(queryParams);
    const keys = Object.keys(qsp);
    const basePath = this.toRouterLink(routeParams);

    if (keys.length === 0) {
      return basePath;
    }

    const qspString = keys
      .filter((key) => isInstantiated(qsp[key]))
      .map((key) => `${key}=${qsp[key]}`)
      .join("&");
    return qspString.length > 0 ? `${basePath}?${qspString}` : basePath;
  }

  /**
   * Compile the Routes list to insert into the RouterModule. This is
   * how StrongRoute converts to the Angular Route system.
   *
   * Example usage:
   * ```typescript
   * RouterModule.forChild(
   *  strongRoute.compileRoutes(getRouteConfigForPage)
   * );
   * ```
   *
   * @param callback Callback function (usually: `getRouteConfigForPage`)
   * which allows the 'pages' to add extra route data or modifications when
   * they are set up
   */
  public compileRoutes(callback: RouteConfigCallback): Routes {
    const rootRoute = this.root;
    const output: Routes = [];

    const sortRoutes = (a: Route, b: Route): -1 | 0 | 1 => {
      // Root route wins
      if (a.path === StrongRoute.rootPath || b.path === StrongRoute.rootPath) {
        // Cannot have multiple root routes
        return a.path === StrongRoute.rootPath ? -1 : 1;
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
        // Give priority to the non-parameter route
        // Cannot have multiple parameter routes at the same level
        return aParamRoute ? 1 : -1;
      }

      return 0;
    };

    const recursiveAdd = (current: StrongRoute): void => {
      const route = callback(current.pageComponent, current.angularRouteConfig);
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
   * Map the routes from the root (base) StrongRoute to the current StrongRoute.
   * The output is split so that a list of parameter StrongRoutes is produced
   * alongside the full list of StrongRoutes.
   *
   * Output: [StrongRoutes list, parameter StrongRoutes list]
   */
  private rootToHere(): [StrongRoute[], StrongRoute[]] {
    const fragments = [];
    const parameters = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
