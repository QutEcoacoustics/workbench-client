import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { GlobalsService } from "@services/globals/globals.service";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { filter, Observable, takeUntil } from "rxjs";
import { IS_SERVER_PLATFORM } from "./app.helper";
import { withUnsubscribe } from "./helpers/unsubscribe/unsubscribe";
import { ConfigService } from "./services/config/config.service";

declare const gtag: Gtag.Gtag;

/**
 * App Root Component
 */
@Component({
  selector: "baw-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  /*
   * Need this so that router-outlet components can be styled. If removed,
   * validate that pages which rely on full height pages such as IFrames are
   * unaffected
   */
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent extends withUnsubscribe() implements OnInit {
  public fullscreen: boolean;
  public delayedProgress$: Observable<number>;
  public resolvedSuccessfully: boolean;

  public constructor(
    public menu: MenuService,
    private sharedRoute: SharedActivatedRouteService,
    private config: ConfigService,
    private title: Title,
    private router: Router,
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
  }

  public ngOnInit(): void {
    this.title.setTitle(this.config.settings.brand.short);
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
      this.sharedRoute.pageComponentInstance = componentInstance as PageComponent;
    }
  }
}
