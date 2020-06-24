import { Component, Input } from "@angular/core";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { apiReturnCodes } from "src/app/services/baw-api/baw-api.service";

/**
 * Error Handler Wrapper
 */
@Component({
  selector: "baw-error-handler",
  template: `
    <ng-container *ngIf="error">
      <div [ngSwitch]="error.status">
        <h1>
          <ng-container *ngSwitchCase="apiReturnCodes.unauthorized">
            Unauthorized Access
          </ng-container>
          <ng-container *ngSwitchCase="apiReturnCodes.notFound">
            Not Found
          </ng-container>
          <ng-container *ngSwitchDefault>Unknown Error</ng-container>
        </h1>
      </div>

      <p>{{ error.message }}</p>
    </ng-container>
  `,
})
export class ErrorHandlerComponent {
  @Input() error: ApiErrorDetails;
  public apiReturnCodes = apiReturnCodes;

  constructor() {}
}
