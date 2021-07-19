import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ConfigService } from "@services/config/config.service";
import { interval } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-client",
  template: `
    <baw-loading *ngIf="loading"></baw-loading>

    <iframe *ngIf="url" #content [src]="url" (load)="updateIframeSize()">
      <!-- This warning only shows on browsers which don't support iframes -->
      <p>
        Unfortunately your browser does not support iframes. Please ensure you
        are utilising a common browser which is running the most up to date
        version.
      </p>
    </iframe>
  `,
  styles: [
    `
      iframe {
        width: 100%;
        min-height: 100%;
        border: 0px;
      }
    `,
  ],
})
export class BawClientComponent extends withUnsubscribe() implements OnInit {
  @ViewChild("content") private iframeRef: ElementRef<HTMLIFrameElement>;
  /**
   * Forces baw-client to render a specific page. The page url should be relative,
   * beginning with a `/`
   */
  @Input() public page: string;
  public url: SafeResourceUrl;
  public loading = true;
  /** Used to track the height of the iframe */
  private previousHeight = 0;
  private iframeUpdateIntervalMs = 250;

  public constructor(
    private config: ConfigService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  public ngOnInit() {
    if (isInstantiated(this.page)) {
      // Use page provided
      this.updateUrl(this.page);
    } else {
      // Use router url
      this.updateUrl(this.router.url);

      // Monitor any changes to current url
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntil(this.unsubscribe)
        )
        .subscribe((event: NavigationEnd) => this.updateUrl(event.url));
    }

    // Update iframe size every 250 milliseconds
    interval(this.iframeUpdateIntervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updateIframeSize());
  }

  public updateIframeSize() {
    const iframe = this.iframeRef?.nativeElement;
    // * Note: This will not work during development because we cannot access the scrollHeight
    // *    of iframes which exist on another domain
    const currentHeight = iframe?.contentDocument?.body?.scrollHeight;

    // If iframe has not been built, current height is not available, or no change in size
    if (!iframe || !currentHeight || currentHeight === this.previousHeight) {
      return;
    }

    // Add 50px of padding to account for margin/padding/scrollbar
    this.loading = false;
    const padding = 50;
    this.previousHeight = currentHeight;
    iframe.style.height = currentHeight + padding + "px";
  }

  protected updateUrl(url: string) {
    // Bypass angular default security
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.config.getBawClientUrl(url)
    );
  }
}
