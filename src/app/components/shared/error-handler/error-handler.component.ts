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
      <h1>{{ getTitle() }}</h1>

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
  public titles = {
    [httpCodes.UNAUTHORIZED]: "Unauthorized Access",
    [httpCodes.FORBIDDEN]: "Access Forbidden",
    [httpCodes.NOT_FOUND]: "Not Found",
    [httpCodes.REQUEST_TIMEOUT]: "Request Timed Out",
    [httpCodes.BAD_GATEWAY]: "Connection Failure",
  };

  public getTitle() {
    const message = this.titles[this.error.status];
    return !message ? "Unknown Error" : message;
  }
}
