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
import { StrongRouteDirective } from "./strong-route.directive";

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
  public set strongRouteActiveOptions(
    data: { exact: boolean } | IsActiveMatchOptions
  ) {
    super.routerLinkActiveOptions = data;
  }

  public constructor(
    _router: Router,
    _element: ElementRef,
    _renderer: Renderer2,
    _cdr: ChangeDetectorRef,
    @Optional() _link?: RouterLink,
    @Optional() _linkWithHref?: StrongRouteDirective
  ) {
    super(_router, _element, _renderer, _cdr, _link, _linkWithHref);
  }
}
