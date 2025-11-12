import { LocationStrategy } from "@angular/common";
import { Directive, ElementRef, Input, Renderer2 } from "@angular/core";
import {
  ActivatedRoute,
  DefaultUrlSerializer,
  Params,
  Router,
  RouterLink,
  UrlTree,
} from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";

/**
 * @description
 * An extension of the Angular RouterLink directive.
 * This allows you to use a string url instead of an array of route segments.
 */
@Directive({ selector: "a[bawUrl]" })
export class UrlDirective extends withUnsubscribe(RouterLink) {
  @Input() public bawUrl: string;
  @Input() public queryParams: Params;

  public constructor(
    _element: ElementRef,
    _renderer: Renderer2,
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
  ) {
    // the `null` value in this constructor is used for the tabIndexAttribute
    // since this is a generic directive, tab indexes should be set by the parent anchor element
    super(router, route, null, _renderer, _element, locationStrategy);
  }

  public get urlTree(): UrlTree {
    if (!this.bawUrl) {
      return super.urlTree;
    }

    const tree = new DefaultUrlSerializer().parse(this.bawUrl);
    tree.fragment = this.fragment ?? null;

    /*
     * Assign to queryParams before a request to queryParamMap occurs
     * otherwise this change will never affect queryParamMap.
     * https://github.com/angular/angular/blob/e3f09ce845cef9fd2c89d39d0d822114c51e68fa/packages/router/src/url_tree.ts#L119-L124
     */
    Object.assign(tree.queryParams, this.queryParams);
    return tree;
  }
}
