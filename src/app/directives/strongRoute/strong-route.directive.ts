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
import { Region } from "@models/Region";
import { ConfigService } from "@services/config/config.service";
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
  private angularRouteParams: Params;

  public constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private config: ConfigService,
    _locationStrategy: LocationStrategy
  ) {
    super(_router, _route, _locationStrategy);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.strongRoute.isFirstChange) {
      this._route.params
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((params) => (this.angularRouteParams = params));
    }

    if (this.config.settings.hideProjects) {
      this.routerLink = this.strongRoute?.toRouterLink({
        projectId: Region.defaultProjectId,
        ...this.angularRouteParams,
        ...this.routeParams,
      });
    } else {
      this.routerLink = this.strongRoute?.toRouterLink({
        ...this.angularRouteParams,
        ...this.routeParams,
      });
    }

    super.ngOnChanges(changes);
  }

  public get urlTree(): UrlTree {
    const queryParams = { ...this.queryParams, ...this.angularRouteParams };

    return this._router.createUrlTree(this["commands"], {
      relativeTo: this._route,
      queryParams: this.strongRoute?.queryParams(queryParams) ?? undefined,
      fragment: this.fragment,
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: attrBoolValue(this.preserveFragment),
    });
  }
}

function attrBoolValue(s: any): boolean {
  return s === "" || !!s;
}
