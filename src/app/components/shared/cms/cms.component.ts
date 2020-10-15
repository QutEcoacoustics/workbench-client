import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { CMS, CmsService } from "@baw-api/cms/cms.service";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";

/**
 * CMS Wrapper
 */
@Component({
  selector: "baw-cms",
  template: `
    <div id="cms-content" *ngIf="blob" [innerHtml]="blob"></div>
    <baw-loading *ngIf="loading" title="Loading"></baw-loading>
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
export class CmsComponent extends WithUnsubscribe() implements OnInit {
  @Input() public page: CMS;
  public blob: SafeHtml;
  public error: ApiErrorDetails;
  public loading: boolean;

  constructor(private cms: CmsService, private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {
    this.loading = true;

    this.cms.get(this.page).subscribe(
      (blob) => {
        this.blob = blob;
        this.loading = false;
        this.ref.detectChanges();
      },
      (err: ApiErrorDetails) => {
        this.error = err;
        this.loading = false;
        this.ref.detectChanges();
      }
    );
  }
}
