import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ConfigService } from "@services/config/config.service";
import { filter, takeUntil } from "rxjs/operators";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-client",
  template: `
    <baw-loading *ngIf="loading"></baw-loading>

    <iframe *ngIf="url" #content [src]="url">
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

  @HostListener("window:message", ["$event"])
  private onBawClientMessage(event: MessageEvent): void {
    // Ignore events which are not from the old client
    if (event.origin !== this.config.endpoints.oldClientOrigin) {
      return;
    }

    try {
      const meta: { height: number } = JSON.parse(event.data);

      if (meta.height > 0) {
        this.loading = false;
        this.updateIframeSize(meta.height);
      }
    } catch (e: any) {
      // Ignore message
    }
  }

  public constructor(
    private config: ConfigService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  public ngOnInit(): void {
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
  }

  private updateIframeSize(height: number): void {
    const iframe = this.iframeRef?.nativeElement;
    // Add 50px of padding to account for margin/padding/scrollbar
    const padding = 50;
    iframe.style.height = height + padding + "px";
  }

  private updateUrl(url: string): void {
    const { oldClientOrigin, oldClientBase } = this.config.endpoints;

    // Bypass angular default security
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      oldClientOrigin + oldClientBase + "#" + url
    );
  }
}
