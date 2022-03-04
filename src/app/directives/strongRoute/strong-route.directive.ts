import { LocationStrategy } from "@angular/common";
import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
  UrlTree,
} from "@angular/router";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { isIPageInfo, PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { takeUntil } from "rxjs/operators";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[strongRoute]",
})
export class StrongRouteDirective
  extends withUnsubscribe(RouterLinkWithHref)
  implements OnChanges
{
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

  // TODO Track page data route and query params as well so they dont need to
  // be specified everywhere?
  private data = {
    resolvedModels: {} as ResolvedModelList,
    routeParams: {} as Params,
    queryParams: {} as Params,
  };

  public constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    _locationStrategy: LocationStrategy
  ) {
    super(_router, _route, _locationStrategy);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.strongRoute?.isFirstChange) {
      // TODO It should be possible to combine all of these instead of having
      // three separate observers

      // Track changes to route parameters
      this._route.params
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((params) => {
          this.data.routeParams = params;
        });
      // Track changes to query parameters
      this._route.queryParams
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((qsp) => (this.data.queryParams = qsp));
      // Track changes to resolved models
      this._route.data.pipe(takeUntil(this.unsubscribe)).subscribe((data) => {
        if (!data || !isIPageInfo(data)) {
          return;
        }

        // Try convert data into page info
        try {
          // We are passing through resolved models even when some fail, this is
          // so that some links unrelated to the broken model do not break
          const resolvedModels = retrieveResolvers(new PageInfo(data));
          if (resolvedModels) {
            this.data.resolvedModels = resolvedModels;
          }
        } catch (err) {
          // Something invalid in data, not useful
        }
      });
    }

    this.routerLink = this.strongRoute?.toRouterLink({
      ...this.data.routeParams,
      ...this.routeParams,
    });

    super.ngOnChanges(changes);
  }

  public get urlTree(): UrlTree {
    if (!this["commands"]) {
      return null;
    }

    const queryParams =
      this.strongRoute?.queryParams(
        {
          ...this.queryParams,
          ...this.data.queryParams,
          ...this.data.routeParams,
        },
        this.data.resolvedModels
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

    return this._router.createUrlTree(this["commands"], {
      relativeTo: this._route,
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
