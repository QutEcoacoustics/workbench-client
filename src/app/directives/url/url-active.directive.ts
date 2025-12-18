import { ChangeDetectorRef, ContentChildren, Directive, ElementRef, Input, QueryList, Renderer2, inject } from "@angular/core";
import { Router, RouterLinkActive } from "@angular/router";
import { RouterLinkActiveOptions } from "@directives/strongRoute/strong-route-active.directive";
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
  public set bawUrlActiveOptions(data: RouterLinkActiveOptions) {
    super["routerLinkActiveOptions"] = data ?? { exact: false };
  }

  public constructor() {
    const _router = inject(Router);
    const _element = inject(ElementRef);
    const _renderer = inject(Renderer2);
    const _cdr = inject(ChangeDetectorRef);
    const _link = inject(UrlDirective, { optional: true });

    super(_router, _element, _renderer, _cdr, _link);
  }
}
