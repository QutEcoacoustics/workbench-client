import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Observable } from "rxjs";
import { delay, map, takeUntil, withLatestFrom } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { WithUnsubscribe } from "./helpers/unsubscribe/unsubscribe";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent extends WithUnsubscribe() implements OnInit {
  menuLayout: boolean;
  delayedProgress$: Observable<number>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private loader: LoadingBarService
  ) {
    super();
  }

  ngOnInit() {
    this.title.setTitle(environment.values.brand.name);
    this.menuLayout = true;

    /**
     * Delay showing loading bar
     */
    this.delayedProgress$ = this.loader.progress$.pipe(
      delay(3000),
      withLatestFrom(this.loader.progress$),
      map(v => v[1])
    );

    // Determine whether the currently shown component uses the menu layout or fullscreen
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          // Find the primary router component
          let displayComponent = this.route.snapshot.firstChild;
          let search = true;
          let count = 0;
          while (search && count < 50) {
            if (!displayComponent) {
              return;
            }

            if (!!displayComponent.component) {
              search = false;
            } else {
              displayComponent = displayComponent.firstChild;
            }

            count++;
          }

          if (count === 50) {
            console.error(
              "Search for component layout type exceeded a depth of 50."
            );
          }

          // Check if component is a page info component and is not set to fullscreen
          const pageInfo = (displayComponent.component as any).pageInfo;
          this.menuLayout = !!pageInfo && !pageInfo.fullscreen;
        }
      },
      err => {}
    );
  }
}
