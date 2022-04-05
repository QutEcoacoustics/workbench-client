import { RouterLinkWithHref } from "@angular/router";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { RouterLinkActiveOptions } from "@directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { StrongRoute } from "@interfaces/strongRoute";

declare global {
  namespace jasmine {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<T> {
      toHaveComputedStyle(expected: Partial<CSSStyleDeclaration>): boolean;
      toHaveHref(href: string): boolean;
      toHaveIcon(
        icon: IconProp,
        props?: Partial<Exclude<FaIconComponent, "icon">>
      ): boolean;
      toHaveImage(
        src: string,
        imageProps?: Partial<HTMLImageElement>,
        directiveProps?: Partial<AuthenticatedImageDirective>
      ): boolean;
      toHaveTooltip(tooltip: string): boolean;
      toHaveRoute(
        routerLink: string,
        props?: Partial<Exclude<RouterLinkWithHref, "routerLink">>
      ): boolean;
      toHaveStrongRoute(
        strongRoute: StrongRoute,
        props?: Partial<Exclude<StrongRouteDirective, "strongRoute">>
      ): boolean;
      toHaveStrongRouteActive(
        klass: string,
        options?: RouterLinkActiveOptions
      ): boolean;
      toHaveUrl(
        bawUrl: string,
        props?: Partial<Exclude<UrlDirective, "bawUrl">>
      ): boolean;
      toHaveUrlActive(
        klass: string,
        options?: RouterLinkActiveOptions
      ): boolean;
    }
  }
}
