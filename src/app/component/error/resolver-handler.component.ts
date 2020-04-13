import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { PageInfoInterface } from "src/app/helpers/page/pageInfo";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { Resolvers } from "src/app/interfaces/menusInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { apiReturnCodes } from "src/app/services/baw-api/baw-api.service";

@Component({
  template: `
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class ResolverHandlerComponent extends WithUnsubscribe()
  implements OnInit {
  public error: ApiErrorDetails;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    // Detect any page errors
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: PageInfoInterface) => {
        this.handleResolvers(data);
      },
      err => {
        console.error("ErrorHandlerComponent: ", err);
        this.error = {
          status: apiReturnCodes.unknown,
          message: "Unable to load data from Server."
        };
      }
    );
  }

  private handleResolvers(data: PageInfoInterface) {
    // Find page resolvers
    const resolvers: Resolvers = {};
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
