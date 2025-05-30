import { Component, OnInit } from "@angular/core";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { UNAUTHORIZED } from "http-status";
import { takeUntil } from "rxjs/operators";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";

@Component({
  selector: "baw-resolver-handler",
  template: `
    @if (error) {
      <baw-error-handler [error]="error"></baw-error-handler>
    }
  `,
  imports: [ErrorHandlerComponent],
})
export class ResolverHandlerComponent
  extends withUnsubscribe()
  implements OnInit
{
  public error: BawApiError;

  public constructor(private sharedRoute: SharedActivatedRouteService) {
    super();
  }

  public ngOnInit() {
    // Detect any page errors
    this.sharedRoute.data
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: IPageInfo) => this.handleResolvers(data));
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
      if (this.error.status === UNAUTHORIZED) {
        return;
      }
    }
  }
}
