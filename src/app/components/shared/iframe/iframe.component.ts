import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { assetRoot } from "@services/app-config/app-config.service";

@Component({
  selector: "baw-iframe",
  template: '<div><iframe [attr.src]="url"></iframe></div>',
  styles: [
    `
      div {
        height: 100%;
        display: flex;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 0px;
      }
    `,
  ],
})
export class IFrameComponent extends withUnsubscribe() implements OnInit {
  public url: SafeResourceUrl;

  public constructor(private router: Router, private sanitizer: DomSanitizer) {
    super();
  }

  public ngOnInit() {
    // Transform the url into the format required by AngularJS
    const requestedUrl = assetRoot + "/old-client/#" + this.router.url;
    // Bypass angular default security
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(requestedUrl);
  }
}
