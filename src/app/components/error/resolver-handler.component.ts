import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { apiReturnCodes } from "@baw-api/baw-api.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { takeUntil } from "rxjs/operators";

@Component({
  template: `
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
export class ResolverHandlerComponent
  extends withUnsubscribe()
  implements OnInit {
  public error: ApiErrorDetails;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    // Detect any page errors
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: IPageInfo) => this.handleResolvers(data),
      (err) => {
        console.error("ErrorHandlerComponent: ", err);
        this.error = {
          status: apiReturnCodes.unknown,
          message: "Unable to load data from Server.",
        };
      }
    );
  }

  private handleResolvers(data: IPageInfo) {
    // Reset error
    this.error = null;

    // Skip if no resolvers
    if (!data.resolvers) {
      return;
    }

    // For each page resolver
    for (const key of Object.keys({ ...data.resolvers })) {
      // Skip if not an error
      if (!data[key].error) {
        continue;
      }

      this.error = data[key].error;
      // If unauthorized response, no point downgrading to "Not Found"
      if (this.error.status === apiReturnCodes.unauthorized) {
        return;
      }
    }
  }
}
