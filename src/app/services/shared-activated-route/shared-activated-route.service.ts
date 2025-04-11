import { Injectable, Type } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Params,
  Router,
  UrlSegment,
} from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo, isIPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { BehaviorSubject, filter, map, Observable, Subscriber, switchMap, takeUntil } from "rxjs";

/**
 * Components outside of the router-outlet are unable to cleanly access data
 * from inside the router-outlet. This affects things like the menu which
 * exists outside of the current route, and thus cannot access route/query
 * parameters. To bypass this, we pass the activated route to this service,
 * and then pass it along to the components which rely on this information.
 *
 * Some relevant issues documenting this issue:
 *
 * - https://github.com/angular/angular/issues/15004
 * - https://github.com/angular/angular/issues/11023
 */
@Injectable({ providedIn: "root" })
export class SharedActivatedRouteService extends withUnsubscribe() {
  private currentActivatedRoute: ActivatedRoute;
  private _activatedRoute: BehaviorSubject<ActivatedRoute>;
  private _url: Observable<UrlSegment[]>;
  private _params: Observable<Params>;
  private _queryParams: Observable<Params>;
  private _fragment: Observable<string | null>;
  private _data: Observable<Data>;
  private _component: Observable<Type<any> | string | null>;
  private _pageComponentInstance: PageComponent;
  private _snapshot: Observable<ActivatedRouteSnapshot>;

  public constructor(router: Router, route: ActivatedRoute) {
    super();
    this.setActivatedRoute(route);
    this.observeRouterEvents(router, route);

    this._url = this.trackObservableProperty(({ url }) => url);
    this._params = this.trackObservableProperty(({ params }) => params);
    this._queryParams = this.trackObservableProperty(({ queryParams }) => queryParams);
    this._fragment = this.trackObservableProperty(({ fragment }) => fragment);
    this._data = this.trackObservableProperty(({ data }) => data);
    this._component = this.trackProperty(({ component }) => component);
    this._snapshot = this.trackProperty(({ snapshot }) => snapshot);
  }

  /** An observable of the URL segments matched by the current route. */
  public get url(): Observable<UrlSegment[]> {
    return this._url;
  }

  /** An observable of the matrix parameters scoped to the current route. */
  public get params(): Observable<Params> {
    return this._params;
  }

  /** An observable of the query parameters shared by all the routes. */
  public get queryParams(): Observable<Params> {
    return this._queryParams;
  }

  /** An observable of the URL fragment shared by all the routes. */
  public get fragment(): Observable<string | null> {
    return this._fragment;
  }

  /** An observable of the static and resolved data of the current route. */
  public get data(): Observable<Data> {
    return this._data;
  }

  /** An observable of the component of the current route */
  public get component(): Observable<Type<any> | string | null> {
    return this._component;
  }

  /** An observable of the current snapshot of the current route */
  public get snapshot(): Observable<ActivatedRouteSnapshot> {
    return this._snapshot;
  }

  /** An observable of the current activated route of the current route */
  public get activatedRoute(): Observable<ActivatedRoute> {
    return this._activatedRoute;
  }

  /**
   * An observable of the static and resolved page info data of the current
   * route.
   */
  public get pageInfo(): Observable<IPageInfo> {
    return this.data.pipe(filter((data): boolean => isIPageInfo(data)));
  }

  public get pageComponentInstance(): PageComponent {
    return this._pageComponentInstance;
  }

  public set pageComponentInstance(instance: PageComponent) {
    this._pageComponentInstance = instance;
  }

  /**
   * Track an observable property of the current route
   *
   * @param callback A callback to be called when the current route changes
   */
  private trackObservableProperty<T>(callback: (value: ActivatedRoute, index: number) => Observable<T>): Observable<T> {
    return this.activatedRoute.pipe(switchMap(callback));
  }

  /**
   * Track a normal property of the current route
   *
   * @param callback A callback to be called when the current route changes
   */
  private trackProperty<T>(callback: (value: ActivatedRoute, index: number) => T): Observable<T> {
    return this.activatedRoute.pipe(map(callback));
  }

  private observeRouterEvents(router: Router, route: ActivatedRoute): void {
    /** Recursively find all children, and return in order with observable */
    const expandAllChildren = (): Observable<ActivatedRoute> => {
      // Set a maximum depth to check. The spectator ActivatedRouteStub has
      // infinite children, which causes errors during tests
      const maxDepth = 5;
      let depth = 0;

      const expandChildren = async (sub: Subscriber<ActivatedRoute>, _route: ActivatedRoute): Promise<void> => {
        depth++;
        sub.next(_route);

        if (depth < maxDepth) {
          _route.children.forEach((child) => expandChildren(sub, child));
        }
      };

      return new Observable((sub) => {
        expandChildren(sub, route.root);
        sub.complete();
      });
    };
    /** Only care about primary outlets */
    const isPrimaryOutlet = (_route: ActivatedRoute): boolean => _route.outlet === "primary";
    /** Only care about page components */
    const isPageComponent = (_route: ActivatedRoute): boolean =>
      (_route.component as any)?.prototype instanceof PageComponent;

    router.events
      .pipe(
        filter((e): boolean => e instanceof NavigationEnd),
        switchMap(expandAllChildren),
        filter(isPrimaryOutlet),
        filter(isPageComponent),
        takeUntil(this.unsubscribe),
      )
      .subscribe((_route: ActivatedRoute): void => {
        this.setActivatedRoute(_route);
      });
  }

  private setActivatedRoute(route: ActivatedRoute): void {
    // Only update things if the activated route changes
    if (this.currentActivatedRoute === route) {
      return;
    }

    this.currentActivatedRoute = route;
    if (this._activatedRoute) {
      this._activatedRoute.next(route);
    } else {
      this._activatedRoute = new BehaviorSubject(route);
    }
  }
}
