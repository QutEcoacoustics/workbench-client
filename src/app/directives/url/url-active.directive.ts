import {
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  Optional,
  QueryList,
  Renderer2,
} from "@angular/core";
import {
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { UrlDirective } from "./url.directive";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[bawUrlActive]",
})
export class UrlActiveDirective extends RouterLinkActive {
  @ContentChildren(UrlDirective, { descendants: true })
  public linksWithHrefs!: QueryList<UrlDirective>;

  @Input()
  public set bawUrlActive(data: string[] | string) {
    super.routerLinkActive = data;
  }

  @Input()
  public set bawUrlActiveOptions(
    data: { exact: boolean } | IsActiveMatchOptions
  ) {
    super.routerLinkActiveOptions = data ?? { exact: false };
  }

  public constructor(
    _router: Router,
    _element: ElementRef,
    _renderer: Renderer2,
    _cdr: ChangeDetectorRef,
    @Optional() _link?: RouterLink,
    @Optional() _linkWithHref?: UrlDirective
  ) {
    super(_router, _element, _renderer, _cdr, _link, _linkWithHref);
  }
}
