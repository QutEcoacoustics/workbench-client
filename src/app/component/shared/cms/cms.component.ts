import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { takeUntil } from "rxjs/operators";
import { CMS_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";

@Component({
  selector: "app-cms",
  template: `
    <ng-container *ngIf="blob">
      <div [innerHtml]="blob"></div>
    </ng-container>
    <app-loading [isLoading]="loading"></app-loading>
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class CmsComponent extends WithUnsubscribe() implements OnInit {
  @Input() page: string;
  public blob: SafeHtml;
  public error: ApiErrorDetails;
  public loading: boolean;

  constructor(
    @Inject(CMS_ROOT) private cmsRoot: string,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.http
      .get(this.cmsRoot + this.page, { responseType: "text" })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
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
