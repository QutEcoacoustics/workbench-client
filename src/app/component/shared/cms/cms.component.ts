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

@Component({
  selector: "app-cms",
  template: `
    <ng-container *ngIf="blob; else loading">
      <div [innerHtml]="blob"></div>
    </ng-container>
    <ng-template #loading>
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-success" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </ng-template>
  `
})
export class CmsComponent implements OnInit, OnDestroy {
  @Input() page: string;
  blob: string;
  notifier = new Subject();

  constructor(
    private config: AppConfigService,
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log("cms");
    this.http
      .get(this.config.getConfig().environment.cmsRoot + "/" + this.page, {
        responseType: "text"
      })
      .pipe(takeUntil(this.notifier))
      .subscribe(
        data => {
          this.blob = data;
          this.ref.detectChanges();
        },
        () => {
          this.blob = `Not Found (${this.page}): TODO make me better`;
        }
      );
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
  }
}
