import { Component, Input } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { apiReturnCodes } from "@baw-api/baw-api.service";

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
  @Input() public error: ApiErrorDetails;
  public apiReturnCodes = apiReturnCodes;

  constructor() {}
}
