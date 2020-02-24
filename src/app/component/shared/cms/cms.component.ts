import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
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
export class CmsComponent implements OnInit, OnDestroy {
  @Input() page: string;
  public blob: SafeHtml;
  public error: ApiErrorDetails;
  public loading: boolean;
  private unsubscribe = new Subject();

  constructor(
    private config: AppConfigService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loading = true;
    const config = this.config.getConfig();
    const cms = config.values.cms.find(cmsPage => cmsPage.title === this.page);

    if (!cms) {
      console.error("Failed to find CMS file in environment: ", this.page);
      return;
    }

    const url = config.environment.cmsRoot + cms.url;
    this.http
      .get(url, { responseType: "text" })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          // This is a bit dangerous, however cms should only load from trusted sources.
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
