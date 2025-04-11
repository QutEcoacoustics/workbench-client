import { LocationStrategy } from "@angular/common";
import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute, Params, Router, RouterLink, UrlTree } from "@angular/router";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { isIPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, takeUntil, tap } from "rxjs/operators";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[strongRoute]",
  standalone: false,
})
export class StrongRouteDirective extends withUnsubscribe(RouterLink) implements OnInit {
  @Input() public strongRoute: StrongRoute;
  /**
   * Additional route parameters to apply to the StrongRoute. By default, all
   * of the angular route parameters are already given to the StrongRoute.
   */
  @Input() public routeParams: RouteParams;
  /**
   * Additional query parameters to apply to the StrongRoute. By default, all
   * of the angular route parameters are already given to the StrongRoute.
   */
  @Input() public queryParams: Params;

  private routeState = {
    resolvedModels: {} as ResolvedModelList,
    routeParams: {} as Params,
    queryParams: {} as Params,
    activatedRoute: null as ActivatedRoute,
  };

  public constructor(
    private _router: Router,
    _element: ElementRef,
    _renderer: Renderer2,
    _route: ActivatedRoute,
    private sharedRoute: SharedActivatedRouteService,
    _locationStrategy: LocationStrategy,
  ) {
    // the `null` value in this constructor is used for the tabIndexAttribute
    // since this is a generic directive, tab indexes should be set by the parent anchor element
    super(_router, _route, null, _renderer, _element, _locationStrategy);
  }

  public ngOnInit(): void {
    this.sharedRoute.activatedRoute
      .pipe(
        tap((activatedRoute) => {
          this.routeState.activatedRoute = activatedRoute;
        }),
        map(({ snapshot }) => snapshot),
        tap(({ queryParams, params }) => {
          this.routeState.routeParams = params;
          this.routeState.queryParams = queryParams;
          this.routerLink = this.strongRoute?.toRouterLink({
            ...this.routeState.routeParams,
            ...this.routeParams,
          });
        }),
        tap(({ data }): void => {
          if (!isIPageInfo(data)) {
            return;
          }

          // We are passing through resolved models even when some fail, this is
          // so that some links unrelated to the broken model do not break
          const resolvedModels = retrieveResolvers(data);
          if (resolvedModels) {
            this.routeState.resolvedModels = resolvedModels;
          }
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe({
        next: () => {
          // Call change detection manually because the above observable does not
          // trigger the change detection. This is calling this function:
          // https://github.com/angular/angular/blob/16.0.x/packages/router/src/directives/router_link.ts#L328-L348
          this["updateHref"]();
        },
      });

    // Just in case angular updates the RouterLink one day
    super.ngOnInit?.();
  }

  public get urlTree(): UrlTree {
    if (!this["routerLinkInput"]) {
      return super.urlTree;
    }

    const queryParams =
      this.strongRoute?.queryParams(
        {
          ...this.routeState.routeParams,
          ...this.routeState.queryParams,
          ...this.routeParams,
          ...this.queryParams,
        },
        this.routeState.resolvedModels,
      ) ?? {};

    // Normalize query parameters into string values which can be handled by
    // the browser
    for (const key of Object.keys(queryParams)) {
      if (queryParams[key] instanceof Set) {
        queryParams[key] = Array.from(queryParams[key]);
      }
      if (queryParams[key] instanceof Array) {
        queryParams[key] = queryParams[key].join(",");
      }
    }

    return this._router.createUrlTree(this["routerLinkInput"], {
      relativeTo: this.routeState.activatedRoute,
      queryParams: queryParams ?? undefined,
      fragment: this.fragment,
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: attrBoolValue(this.preserveFragment),
    });
  }
}

function attrBoolValue(s: any): boolean {
  return s === "" || !!s;
}
