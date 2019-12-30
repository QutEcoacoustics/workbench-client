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
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";

@Component({
  selector: "app-cms",
  template: `
    <ng-container *ngIf="blob">
      <div [innerHtml]="blob"></div>
    </ng-container>
    <ng-container *ngIf="loading">
      <h4 class="text-center">Loading</h4>
      <div class="d-flex justify-content-center">
        <mat-spinner diameter="30" strokeWidth="4"></mat-spinner>
      </div>
    </ng-container>
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class CmsComponent implements OnInit, OnDestroy {
  @Input() page: string;
  blob: SafeHtml;
  error: APIErrorDetails;
  loading = true;
  notifier = new Subject();

  constructor(
    private config: AppConfigService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.http
      .get(this.config.getConfig().environment.cmsRoot + "/" + this.page, {
        responseType: "text"
      })
      .pipe(takeUntil(this.notifier))
      .subscribe(
        data => {
          // This is a bit dangerous, however cms should only load from trusted sources.
          // May need to revise this in future.
          this.blob = this.sanitizer.bypassSecurityTrustHtml(data);
          this.loading = false;
          this.ref.detectChanges();
        },
        (err: APIErrorDetails) => {
          this.error = err;
          this.loading = false;
          this.ref.detectChanges();
        }
      );
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
  }
}
