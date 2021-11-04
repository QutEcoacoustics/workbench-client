import { Component, Inject, Input, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import httpCodes from "http-status";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

/**
 * Error Handler Wrapper
 */
@Component({
  selector: "baw-error-handler",
  template: `
    <ng-container *ngIf="error && !hideErrorDetails">
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
export class ErrorHandlerComponent implements OnInit {
  @Input() public error: ApiErrorDetails;
  public reportProblem = reportProblemMenuItem.route;
  public hideErrorDetails: boolean;
  public titles = {
    [httpCodes.UNAUTHORIZED]: "Unauthorized Access",
    [httpCodes.FORBIDDEN]: "Access Forbidden",
    [httpCodes.NOT_FOUND]: "Not Found",
    [httpCodes.REQUEST_TIMEOUT]: "Request Timed Out",
    [httpCodes.BAD_GATEWAY]: "Connection Failure",
  };

  public constructor(@Inject(IS_SERVER_PLATFORM) private isSsr: boolean) {}

  public ngOnInit(): void {
    // If this is SSR, ignore auth or disconnect issues
    if (
      this.isSsr &&
      [
        httpCodes.UNAUTHORIZED,
        httpCodes.REQUEST_TIMEOUT,
        httpCodes.BAD_GATEWAY,
      ].includes(this.error.status)
    ) {
      this.hideErrorDetails = true;
    }
  }

  public getTitle() {
    return this.titles[this.error.status] ?? "Unknown Error";
  }
}
