import { Component } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { delay, map, withLatestFrom } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  menuLayout: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public loader: LoadingBarService
  ) {
    this.menuLayout = true;

    // Determine whether the currently shown component uses the menu layout or fullscreen
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
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
    });
  }

  /**
   * Delay showing loading bar
   */
  delayedProgress$ = this.loader.progress$.pipe(
    delay(3000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1])
  );
}
