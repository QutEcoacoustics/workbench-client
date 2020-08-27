import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { takeUntil } from "rxjs/operators";

/**
 * CMS Wrapper
 */
@Component({
  selector: "baw-cms",
  template: `
    <ng-container *ngIf="blob">
      <div [innerHtml]="blob"></div>
    </ng-container>
    <baw-loading title="Loading" [display]="loading"></baw-loading>
    <baw-error-handler [error]="error"></baw-error-handler>
  `,
})
export class CmsComponent extends WithUnsubscribe() implements OnInit {
  @Input() public page: string;
  public blob: SafeHtml;
  public error: ApiErrorDetails;
  public loading: boolean;

  constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  public ngOnInit() {
    this.loading = true;

    // TODO Replace with API request
    this.http
      // .get(this.apiRoot + this.page, { responseType: "text" })
      .get(`/assets/content${this.page}`, { responseType: "text" })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          // This is a bit dangerous, however CMS should only load from trusted sources.
          // May need to revise this in future.
          this.blob = this.sanitizer.bypassSecurityTrustHtml(data);
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
