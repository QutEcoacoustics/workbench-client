import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Subject } from "rxjs";
import { delay, map, takeUntil, withLatestFrom } from "rxjs/operators";
import { AppConfigService } from "./services/app-config/app-config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe = new Subject();
  menuLayout: boolean;
  googleAnalytics: string;

  /**
   * Delay showing loading bar
   */
  delayedProgress$ = this.loader.progress$.pipe(
    delay(3000),
    withLatestFrom(this.loader.progress$),
    map(v => v[1])
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private config: AppConfigService,
    public loader: LoadingBarService
  ) {}

  ngOnInit() {
    this.menuLayout = true;
    this.googleAnalytics = this.config.getConfig().environment.ga.trackingId;

    // Determine whether the currently shown component uses the menu layout or fullscreen
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          // Google Analytics
          (window as any).ga("set", "page", event.urlAfterRedirects);
          (window as any).ga("send", "pageview");

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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit() {
    /**
     * Add google analytics tag.
     * Whilst using the DOM is bad practice in angular, it does not
     * seem possible to access Services in the index.html file
     * (or event the environment settings). Other potential solutions
     * could be multiple index.html files which are replaced in the
     * angular.json file, or using main.ts to perform the fetch command
     * receiving the environment config and create the script inside the
     * index.html file.
     */
    const s = this.document.createElement("script");
    s.type = "text/javascript";
    s.innerHTML = `
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      'script',
      'https://www.google-analytics.com/analytics.js',
      'ga'
    );
    ga('create', '${this.googleAnalytics}', 'auto');
    `;
    this.elementRef.nativeElement.appendChild(s);
  }
}
