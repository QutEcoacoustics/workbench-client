import { LocationStrategy } from "@angular/common";
import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
  UrlTree,
} from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { RouteParams, StrongRoute } from "@interfaces/strongRoute";
import { takeUntil } from "rxjs/operators";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[strongRoute]",
})
export class StrongRouteDirective
  extends withUnsubscribe(RouterLinkWithHref)
  implements OnChanges {
  @Input() public strongRoute: StrongRoute;
  /**
   * Additional route parameters to apply to the StrongRoute. By
   * default, all of the angular route parameters are already given
   * to the StrongRoute.
   */
  @Input() public routeParams: RouteParams;
  /**
   * Additional query parameters to apply to the StrongRoute. By
   * default, all of the angular route parameters are already given
   * to the StrongRoute.
   */
  @Input() public queryParams: Params;

  /** Points to original classes 'router' */
  private _router: Router;
  /** Points to original classes 'route' */
  private _route: ActivatedRoute;
  private angularRouteParams: Params;

  public constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy
  ) {
    super(router, route, locationStrategy);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this._router || !this._route) {
      this._router = this["router"];
      this._route = this["route"];
      this._route.params
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((params) => (this.angularRouteParams = params));
    }

    this.routerLink = this.strongRoute?.toRouterLink({
      ...this.angularRouteParams,
      ...this.routeParams,
    });
    super.ngOnChanges(changes);
  }

  public get urlTree(): UrlTree {
    const queryParams = { ...this.queryParams, ...this.angularRouteParams };

    return this._router.createUrlTree(this["commands"], {
      relativeTo: this._route,
      queryParams: this.strongRoute?.queryParams(queryParams) ?? undefined,
      fragment: this.fragment,
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: this.preserveFragment,
    });
  }
}
