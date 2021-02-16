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

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[uri]",
})
export class UriDirective extends withUnsubscribe(RouterLinkWithHref) {
  @Input() public uri: string;

  public constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    _locationStrategy: LocationStrategy
  ) {
    super(_router, _route, _locationStrategy);
  }

  public get urlTree(): UrlTree {
    if (!this.uri) {
      return super.urlTree;
    }

    // Construct URL from uri, baseURI does not matter
    const url = new URL(this.uri, document?.baseURI || "http://localhost/");

    // Extract query parameters from uri
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
