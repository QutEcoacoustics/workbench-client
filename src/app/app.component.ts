import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { noop, Observable } from "rxjs";
import { delay, filter, map, takeUntil, withLatestFrom } from "rxjs/operators";
import { withUnsubscribe } from "./helpers/unsubscribe/unsubscribe";
import { AppConfigService } from "./services/app-config/app-config.service";

/**
 * App Root Component
 */
@Component({
  selector: "baw-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent extends withUnsubscribe() implements OnInit {
  public fullscreen: boolean;
  public delayedProgress$: Observable<number>;

  public constructor(
    private env: AppConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private loader: LoadingBarService
  ) {
    super();
  }

  public ngOnInit() {
    this.title.setTitle(this.env.values.brand.name);
    this.fullscreen = true;

    // Delay showing loading bar
    this.delayedProgress$ = this.loader.value$.pipe(
      delay(3000),
      withLatestFrom(this.loader.value$),
      map((v) => v[1])
    );

    // Update page layout after every navigation change
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => this.updatePageLayout(), noop);
  }

  /**
   * Determine whether the currently shown component uses the menu layout or fullscreen
   */
  private updatePageLayout() {
    // Default to fullscreen
    this.fullscreen = true;

    // Find the primary router component
    let displayComponent = this.route.firstChild;
    let count = 0;

    // Continue searching to a depth of 50 components (prevent circular looping)
    while (count < 50) {
      if (!displayComponent) {
        // This is not a display component, cannot go any further
        console.error("Could not find a display component.");
        return;
      } else if (displayComponent.component) {
        // This is a display component, break out of while loop and check page info
        break;
      }

      // Component has a child, keep digging further down
      displayComponent = displayComponent.firstChild;
      count++;
    }

    if (count >= 50) {
      console.error("Search for component layout type exceeded a depth of 50.");
      return;
    }

    // Check if component is a page info component and is not set to fullscreen
    const component: PageComponent = displayComponent.component as any;
    if (!component.pageInfo) {
      this.fullscreen = true;
    } else {
      this.fullscreen = !!component.pageInfo.fullscreen;
    }
  }
}
