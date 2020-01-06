import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit
} from "@angular/core";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { apiReturnCodes } from "src/app/services/baw-api/base-api.service";

@Component({
  selector: "app-error-handler",
  template: `
    <ng-container *ngIf="display === 'unauthorized'">
      <h1>Unauthorized access</h1>
    </ng-container>
    <ng-container *ngIf="display === 'notFound'">
      <h1>Not found</h1>
    </ng-container>
    <ng-container *ngIf="display === 'forbidden'">
      <h1>Forbidden</h1>
    </ng-container>
    <ng-container *ngIf="display === 'unknown'">
      <h1>Unknown Error</h1>
    </ng-container>

    <p *ngIf="error">{{ error.message }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlerComponent implements OnInit, OnChanges {
  @Input() error: APIErrorDetails;
  display = "";

  constructor() {}

  ngOnInit() {
    this.evaluateError();
  }

  ngOnChanges() {
    this.evaluateError();
  }

  evaluateError() {
    if (!this.error?.status && this.error?.status !== 0) {
      this.display = "";
      return;
    }

    switch (this.error.status) {
      case apiReturnCodes.unauthorized:
        this.display = "unauthorized";
        break;

      case apiReturnCodes.notFound:
        this.display = "notFound";
        break;

      case apiReturnCodes.forbidden:
        this.display = "forbidden";
        break;

      default:
        this.display = "unknown";
        break;
    }
  }
}
