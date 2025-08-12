import { Component, Inject, Input, OnInit } from "@angular/core";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import {
  ApiErrorDetails,
  BawApiError,
} from "@helpers/custom-errors/baw-api-error";
import {
  FORBIDDEN,
  NOT_FOUND,
  REQUEST_TIMEOUT,
  UNAUTHORIZED,
} from "http-status";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";

/**
 * Error Handler Wrapper
 */
@Component({
  selector: "baw-error-handler",
  template: `
    @if (error && !hideErrorDetails) {
      <h1>{{ getTitle() }}</h1>

      <p>{{ error.message }}</p>
      <p>
        If you continue to encounter this error, please go to the
        <a [strongRoute]="reportProblem">Report Problems</a> page and report the
        issue.
      </p>
    }
  `,
  imports: [StrongRouteDirective],
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
    [CLIENT_TIMEOUT]: "Connection Failure",
  } as const;

  public constructor(@Inject(IS_SERVER_PLATFORM) private isSsr: boolean) {}

  public ngOnInit(): void {
    if (!this.error) {
      return;
    }

    // If this is SSR, ignore auth or disconnect issues
    if (
      this.isSsr &&
      [UNAUTHORIZED, REQUEST_TIMEOUT, CLIENT_TIMEOUT].includes(
        this.error.status
      )
    ) {
      this.hideErrorDetails = true;
    }
  }

  public getTitle(): string {
    return this.titles[this.error.status] ?? "Unknown Error";
  }
}
