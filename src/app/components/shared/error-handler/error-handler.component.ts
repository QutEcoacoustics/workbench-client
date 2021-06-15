import { Component, Input } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import httpCodes from "http-status";

/**
 * Error Handler Wrapper
 */
@Component({
  selector: "baw-error-handler",
  template: `
    <ng-container *ngIf="error">
      <div [ngSwitch]="error.status">
        <h1>
          <ng-container *ngSwitchCase="httpCodes.UNAUTHORIZED">
            Unauthorized Access
          </ng-container>
          <ng-container *ngSwitchCase="httpCodes.FORBIDDEN">
            Access Forbidden
          </ng-container>
          <ng-container *ngSwitchCase="httpCodes.NOT_FOUND">
            Not Found
          </ng-container>
          <ng-container *ngSwitchCase="httpCodes.REQUEST_TIMEOUT">
            Request Timed Out
          </ng-container>
          <ng-container *ngSwitchDefault>Unknown Error</ng-container>
        </h1>
      </div>

      <p>{{ error.message }}</p>
      <p>
        If you continue to encounter this error, please go to the
        <a [strongRoute]="reportProblem">Report Problems</a> page and report the
        issue.
      </p>
    </ng-container>
  `,
})
export class ErrorHandlerComponent {
  @Input() public error: ApiErrorDetails;
  public reportProblem = reportProblemMenuItem.route;
  public httpCodes = httpCodes;
}
