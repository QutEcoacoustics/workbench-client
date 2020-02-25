import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Inject
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { CMS_ROOT } from "src/app/helpers/app-initializer/app-initializer";

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
export class CmsComponent implements OnInit, OnDestroy {
  @Input() page: string;
  public blob: SafeHtml;
  public error: ApiErrorDetails;
  public loading: boolean;
  private unsubscribe = new Subject();

  constructor(
    @Inject(CMS_ROOT) private cmsRoot: string,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
