import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { Observable, takeUntil } from "rxjs";
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
  public resolvedSuccessfully: boolean;

  public constructor(
    public menu: MenuService,
    private sharedRoute: SharedActivatedRouteService,
    private config: ConfigService,
    private title: Title
  ) {
    super();
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
  }
}
