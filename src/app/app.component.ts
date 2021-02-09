import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { PageInfo } from "@helpers/page/pageInfo";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Observable } from "rxjs";
import { delay, map, withLatestFrom } from "rxjs/operators";
import { withUnsubscribe } from "./helpers/unsubscribe/unsubscribe";
import { ConfigService } from "./services/config/config.service";

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

  public constructor(
    private config: ConfigService,
    private title: Title,
    private loader: LoadingBarService
  ) {
    super();
  }

  public ngOnInit() {
    this.title.setTitle(this.config.values.brand.name);
    this.fullscreen = true;

    // Delay showing loading bar
    this.delayedProgress$ = this.loader.value$.pipe(
      delay(3000),
      withLatestFrom(this.loader.value$),
      map((v) => v[1])
    );
  }

  /**
   * Determine whether the currently shown component uses the menu layout or fullscreen.
   * Router-outlets emit an activate event `(activate)` when a new component is
   * instantiated, this event contains a reference to the enclosed component. This
   * allows us to hook into the default router-outlet's component (which is the page
   * component) and read the pageInfo from the component. This will run whenever the
   * component rendered inside the router-outlet changes.
   */
  public updatePageLayout(component: any) {
    this.fullscreen = !!(component?.constructor?.pageInfo as PageInfo)
      ?.fullscreen;
  }
}
