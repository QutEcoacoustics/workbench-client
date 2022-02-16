import { Component, Inject, Input, OnInit } from "@angular/core";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import {
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  REQUEST_TIMEOUT,
  BAD_GATEWAY,
} from "http-status";
import {
  ApiErrorDetails,
  BawApiError,
} from "@helpers/custom-errors/baw-api-error";

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
  @Input() public error: ApiErrorDetails | BawApiError;
  public reportProblem = reportProblemMenuItem.route;
  public hideErrorDetails: boolean;
  public titles = {
    [UNAUTHORIZED]: "Unauthorized Access",
    [FORBIDDEN]: "Access Forbidden",
    [NOT_FOUND]: "Not Found",
    [REQUEST_TIMEOUT]: "Request Timed Out",
    [BAD_GATEWAY]: "Connection Failure",
  };

  public constructor(@Inject(IS_SERVER_PLATFORM) private isSsr: boolean) {}

  public ngOnInit(): void {
    if (!this.error) {
      return;
    }

    // If this is SSR, ignore auth or disconnect issues
    if (
      this.isSsr &&
      [UNAUTHORIZED, REQUEST_TIMEOUT, BAD_GATEWAY].includes(this.error.status)
    ) {
      this.hideErrorDetails = true;
    }
  }

  public getTitle() {
    return this.titles[this.error.status] ?? "Unknown Error";
  }
}
