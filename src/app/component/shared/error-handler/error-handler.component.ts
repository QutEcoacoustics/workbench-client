import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { BawApiService } from "src/app/services/baw-api/base-api.service";

@Component({
  selector: "app-error-handler",
  template: `
    <ng-container *ngIf="display === 'unauthorized'">
      <h1>Unauthorized access</h1>
      <p>You need to log in or register before continuing.</p>
    </ng-container>
    <ng-container *ngIf="display === 'notFound'">
      <h1>Not found</h1>
      <p>Could not find the requested item.</p>
    </ng-container>
    <ng-container *ngIf="display === 'forbidden'">
      <h1>Forbidden</h1>
      <p>You do not have sufficient permissions to access this page.</p>
    </ng-container>
    <ng-container *ngIf="display === 'unknown'">
      <h1>Unknown error</h1>
      <p>
        An unknown error has occurred. Please try again or report the issue.
      </p>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlerComponent implements OnInit, OnChanges {
  @Input() errorCode: number;
  display = "";

  constructor(private api: BawApiService) {}

  ngOnInit() {
    this.evaluateError();
  }

  ngOnChanges() {
    this.evaluateError();
  }

  evaluateError() {
    switch (this.errorCode) {
      case this.api.apiReturnCodes.unauthorized:
        this.display = "unauthorized";
        break;

      case this.api.apiReturnCodes.notFound:
        this.display = "notFound";
        break;

      case this.api.apiReturnCodes.forbidden:
        this.display = "forbidden";
        break;

      case undefined:
      case null:
        this.display = "";
        break;

      default:
        this.display = "unknown";
        break;
    }
  }
}
