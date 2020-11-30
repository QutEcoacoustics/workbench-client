import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { assetRoot } from "@services/config/config.service";
import { interval } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

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
  public url: SafeResourceUrl;
  public loading = true;
  /** Used to track the height of the iframe */
  private previousHeight = 0;

  public constructor(private router: Router, private sanitizer: DomSanitizer) {
    super();
  }

  public ngOnInit() {
    this.updateUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe((event: NavigationEnd) => this.updateUrl(event.url));

    // Update iframe size every 250 milliseconds
    interval(250)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updateIframeSize());
  }

  public updateIframeSize() {
    const iframe = this.iframeRef?.nativeElement;
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

  private updateUrl(url: string) {
    // Transform the url into the format required by AngularJS using hash bang
    const requestedUrl = assetRoot + "/old-client/#" + url;
    // Bypass angular default security
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(requestedUrl);
  }
}
