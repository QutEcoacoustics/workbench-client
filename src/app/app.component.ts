import {
  Component,
  Inject,
  Injectable,
  Injector,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  NavigationEnd,
  Router,
  RouterStateSnapshot,
  TitleStrategy,
} from "@angular/router";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { titleCase } from "@helpers/case-converter/case-converter";
import { PageComponent } from "@helpers/page/pageComponent";
import { MenuRoute, TitleOptionsHash } from "@interfaces/menusInterfaces";
import { GlobalsService } from "@services/globals/globals.service";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { filter, Observable, takeUntil } from "rxjs";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { createCustomElement } from "@angular/elements";
import {
  GridTileContentComponent,
  gridTileContentSelector,
} from "@components/web-components/grid-tile-content/grid-tile-content.component";
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
  styleUrls: ["./app.component.scss", "./print-styles.component.scss"],
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
    protected injector: Injector,
    private sharedRoute: SharedActivatedRouteService,
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

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  public constructor(private title: Title, private config: ConfigService) {
    super();
  }

  private routerState: RouterStateSnapshot;

  /**
   * Recursively builds the title from the page route and its parent routes
   *
   * @param subRoute A page route to construct the title for
   * @returns A title of the route and its parents constructed in the format " | parent | subRoute"
   */
  private buildHierarchicalTitle(subRoute: MenuRoute): string {
    // If the page route has an explicit way to construct the title, use the title callback
    // if there is no `title` callback defined in the menuRoute, use the category label as a fallback
    let componentTitle = "";

    if (subRoute?.title) {
      // in the rare case that the title callback throws an error, the category label should be used as a fallback
      try {
        const hideProjects: boolean = this.config.settings.hideProjects;
        const titleOptions: TitleOptionsHash = { hideProjects };

        const routeFragmentTitle = subRoute.title(
          this.routerState,
          titleOptions
        );

        // to explicitly omit a route title fragment, the title callback will return null
        if (isInstantiated(routeFragmentTitle)) {
          componentTitle = " | " + routeFragmentTitle;
        }
      } catch (error: unknown) {
        componentTitle = titleCase(subRoute.label);
        console.error(`Failed to resolve title callback ${error}`);
      }
    } else {
      // since category labels are not title cased (first letter after space capitalized), we need to title case them
      // since explicit route titles commonly include model names which are case sensitive, explicit titles should not change casing
      // e.g. Project name "Tasmanian wetlands" != "Tasmanian Wetlands" as the user has explicitly not capitalized "Wetlands"
      componentTitle = " | " + titleCase(subRoute.label);
    }

    return subRoute?.parent
      ? this.buildHierarchicalTitle(subRoute.parent) + componentTitle
      : componentTitle;
  }

  // all site titles should follow the format <<brandName>> | ...PageComponentTitles
  // e.g. Ecosounds | Projects | Cooloola | Audio Recordings | 261658
  public override updateTitle(newRouterState: RouterStateSnapshot): void {
    this.routerState = newRouterState;
    const brandName = this.config.settings.brand.short;

    const rootPageRoute = this.routerState.root.firstChild;
    const newTitle = this.buildHierarchicalTitle(rootPageRoute.data.pageRoute);

    this.title.setTitle(brandName + newTitle);
  }
}
