import { Component, Inject, INJECTOR, Injector, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { GlobalsService } from "@services/globals/globals.service";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { filter, Observable, takeUntil } from "rxjs";
import { createCustomElement } from "@angular/elements";
import {
  GridTileContentComponent,
  gridTileContentSelector,
} from "@components/web-components/grid-tile-content/grid-tile-content.component";
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { IS_SERVER_PLATFORM } from "./app.helper";
import { withUnsubscribe } from "./helpers/unsubscribe/unsubscribe";
import { HeaderComponent } from "./components/shared/menu/header/header.component";
import { ToastProviderComponent } from "./components/shared/toast-provider/toast-provider.component";
import { SideNavComponent } from "./components/shared/menu/side-nav/side-nav.component";
import { PrimaryMenuComponent } from "./components/shared/menu/primary-menu/primary-menu.component";
import { SecondaryMenuComponent } from "./components/shared/menu/secondary-menu/secondary-menu.component";
import { ActionMenuComponent } from "./components/shared/menu/action-menu/action-menu.component";
import { BreadcrumbComponent } from "./components/shared/breadcrumb/breadcrumb.component";
import { FooterComponent } from "./components/shared/footer/footer.component";

declare const gtag: Gtag.Gtag;

/**
 * App Root Component
 */
@Component({
  selector: "baw-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "./print-styles.component.scss"],
  imports: [
    HeaderComponent,
    LoadingBarModule,
    ToastProviderComponent,
    SideNavComponent,
    PrimaryMenuComponent,
    SecondaryMenuComponent,
    ActionMenuComponent,
    BreadcrumbComponent,
    RouterOutlet,
    FooterComponent,
  ],
})
export class AppComponent extends withUnsubscribe() implements OnInit {
  public fullscreen: boolean;
  public delayedProgress$: Observable<number>;
  public resolvedSuccessfully: boolean;

  public constructor(
    public menu: MenuService,
    private sharedRoute: SharedActivatedRouteService,
    private router: Router,
    @Inject(INJECTOR) protected injector: Injector,
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean,
    globals: GlobalsService
  ) {
    super();
    /*
     * Perform the initial navigation of the router, this is because we have
     * disabled this in the app routing module
     */
    this.router.initialNavigation();
    globals.initialize();

    // register all web components here
    // we make some of our standalone angular components into standards based web components
    // so that they can operate entirely independently - e.g. in shadow dom
    if (!this.isServer) {
      const hasCustomElement = !!customElements.get(gridTileContentSelector);

      if (!hasCustomElement) {
        const webComponentElement = createCustomElement(
          GridTileContentComponent,
          { injector }
        );
        customElements.define(gridTileContentSelector, webComponentElement);
      }
    }
  }

  public ngOnInit(): void {
    this.fullscreen = true;

    this.sharedRoute.pageInfo
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((pageInfo): void => {
        this.fullscreen = pageInfo.fullscreen;
        this.resolvedSuccessfully = hasResolvedSuccessfully(
          retrieveResolvers(pageInfo)
        );
      });

    // Google Analytics is not tracked during SSR
    if (this.isServer) {
      return;
    }

    // Tell google analytics about each page which is visited
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe((event: NavigationEnd): void => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        gtag("event", "page_view", { page_path: event.urlAfterRedirects });
      });
  }

  protected onRouterOutlet(componentInstance: PageComponent | unknown): void {
    if (componentInstance || componentInstance === null) {
      this.sharedRoute.pageComponentInstance =
        componentInstance as PageComponent;
    }
  }
}
