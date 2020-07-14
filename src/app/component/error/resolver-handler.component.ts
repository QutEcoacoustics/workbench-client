import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { apiReturnCodes } from "@baw-api/baw-api.service";
import { PageInfoInterface } from "@helpers/page/pageInfo";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ResolverList } from "@interfaces/menusInterfaces";
import { takeUntil } from "rxjs/operators";

@Component({
  template: ` <baw-error-handler [error]="error"></baw-error-handler> `,
})
export class ResolverHandlerComponent extends WithUnsubscribe()
  implements OnInit {
  public error: ApiErrorDetails;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    // Detect any page errors
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: PageInfoInterface) => {
        this.handleResolvers(data);
      },
      (err) => {
        console.error("ErrorHandlerComponent: ", err);
        this.error = {
          status: apiReturnCodes.unknown,
          message: "Unable to load data from Server.",
        };
      }
    );
  }

  private handleResolvers(data: PageInfoInterface) {
    // Find page resolvers
    const resolvers: ResolverList = {};
    if (data.resolvers) {
      Object.assign(resolvers, data.resolvers);
    }

    for (const key of Object.keys(resolvers)) {
      if (!data[key].error) {
        continue;
      }

      this.error = data[key].error as ApiErrorDetails;

      // If unauthorized response, no point downgrading to "Not Found"
      if (this.error.status === apiReturnCodes.unauthorized) {
        return;
      }
    }
  }
}
