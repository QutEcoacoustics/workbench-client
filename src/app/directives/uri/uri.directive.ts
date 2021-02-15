import { LocationStrategy } from "@angular/common";
import { Directive, Input, OnChanges } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLinkWithHref,
  UrlTree,
} from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[uri]",
})
export class UriDirective
  extends withUnsubscribe(RouterLinkWithHref)
  implements OnChanges {
  @Input() public uri: string;
  private _router: Router;

  public constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy
  ) {
    super(router, route, locationStrategy);
    this._router = this["router"];
    this._route = this["route"];
  }

  public get urlTree(): UrlTree {
    //TODO Validate this directs to correct path
    return this._router.parseUrl(this.uri);
  }
}
