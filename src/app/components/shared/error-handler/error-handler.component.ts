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
    <ng-container *ngIf="error && !hideError">
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
  public titles = {
    [httpCodes.UNAUTHORIZED]: "Unauthorized Access",
    [httpCodes.FORBIDDEN]: "Access Forbidden",
    [httpCodes.NOT_FOUND]: "Not Found",
    [httpCodes.REQUEST_TIMEOUT]: "Request Timed Out",
    [httpCodes.BAD_GATEWAY]: "Connection Failure",
  };
  public hideError: boolean;

  public constructor(@Inject(IS_SERVER_PLATFORM) private isServer: boolean) {}

  public ngOnInit(): void {
    // TODO Remove this once SSR API requests work #1514
    this.hideError =
      this.isServer && this.error.status === httpCodes.BAD_GATEWAY;
  }

  public getTitle() {
    const message = this.titles[this.error.status];
    return !message ? "Unknown Error" : message;
  }
}
