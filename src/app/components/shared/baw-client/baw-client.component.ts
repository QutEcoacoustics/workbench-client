import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ConfigService } from "@services/config/config.service";
import { filter, takeUntil } from "rxjs/operators";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-client",
  template: `
    <iframe #content *ngIf="url" [src]="url">
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

  public error: boolean;
  public url: SafeResourceUrl;

  @HostListener("window:message", ["$event"])
  private onBawClientMessage(event: MessageEvent): void {
    // Ignore events which are not from the old client
    if (event.origin !== this.config.endpoints.oldClientOrigin) {
      return;
    }

    let meta: { height: number };
    try {
      meta = JSON.parse(event.data);
    } catch (e: any) {
      // Ignore message
    }

    if (meta?.height > 0) {
      this.updateIframeSize(meta.height);
    }
  }

  public constructor(
    @Inject(IS_SERVER_PLATFORM) public isSsr: boolean,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as PageInfo);

    // Don't load client on SSR or if error occurs
    if (!models || this.isSsr) {
      this.url = undefined;
      return;
    }

    if (isInstantiated(this.page)) {
      // Use page provided
      this.updateUrl(this.page);
      return;
    }

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
