import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
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
  blob: string;
  error: APIErrorDetails;
  loading = true;
  notifier = new Subject();

  constructor(
    private config: AppConfigService,
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http
      .get(this.config.getConfig().environment.cmsRoot + "/" + this.page, {
        responseType: "text"
      })
      .pipe(takeUntil(this.notifier))
      .subscribe(
        data => {
          this.blob = data;
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
