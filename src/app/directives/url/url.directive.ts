import { LocationStrategy } from "@angular/common";
import { Directive, Input } from "@angular/core";
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLinkWithHref,
  UrlTree,
} from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";

@Directive({ selector: "a[bawUrl]" })
export class UrlDirective extends withUnsubscribe(RouterLinkWithHref) {
  @Input() public bawUrl: string;

  public constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    _locationStrategy: LocationStrategy
  ) {
    super(_router, _route, _locationStrategy);
  }

  public get urlTree(): UrlTree {
    if (!this.bawUrl) {
      return super.urlTree;
    }

    // Construct URL from url, baseURI does not matter
    const url = new URL(this.bawUrl, document?.baseURI || "http://localhost/");

    // Extract query parameters from url
    const queryParams: Params = {};
    url.searchParams.forEach((value, key) => (queryParams[key] = value));

    return this._router.createUrlTree([url.pathname], {
      relativeTo: this.relativeTo !== undefined ? this.relativeTo : this._route,
      queryParams: { ...this.queryParams, ...queryParams },
      fragment: this.fragment,
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: attrBoolValue(this.preserveFragment),
    });
  }
}

function attrBoolValue(s: any): boolean {
  return s === "" || !!s;
}
