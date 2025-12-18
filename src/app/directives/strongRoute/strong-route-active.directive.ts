import { ChangeDetectorRef, ContentChildren, Directive, ElementRef, Input, QueryList, Renderer2, inject } from "@angular/core";
import {
  IsActiveMatchOptions,
  Router,
  RouterLinkActive,
} from "@angular/router";
import { StrongRouteDirective } from "./strong-route.directive";

export type RouterLinkActiveOptions = { exact: boolean } | IsActiveMatchOptions;

/**
 * @description
 * A directive which works with our custom route format to conditionally check
 * if a link is active.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "a[strongRouteActive]",
})
export class StrongRouteActiveDirective extends RouterLinkActive {
  @ContentChildren(StrongRouteDirective, { descendants: true })
  public linksWithHrefs!: QueryList<StrongRouteDirective>;

  @Input()
  public set strongRouteActive(data: string[] | string) {
    super.routerLinkActive = data;
  }

  @Input()
  public set strongRouteActiveOptions(data: RouterLinkActiveOptions) {
    super["routerLinkActiveOptions"] = data ?? { exact: false };
  }

  public constructor() {
    const _router = inject(Router);
    const _element = inject(ElementRef);
    const _renderer = inject(Renderer2);
    const _cdr = inject(ChangeDetectorRef);
    const _link = inject(StrongRouteDirective, { optional: true });

    super(_router, _element, _renderer, _cdr, _link);
  }
}
