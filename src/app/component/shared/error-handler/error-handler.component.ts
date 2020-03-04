import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { PageInfoInterface } from "src/app/helpers/page/pageInfo";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { Category, Resolvers } from "src/app/interfaces/menusInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { apiReturnCodes } from "src/app/services/baw-api/baw-api.service";

@Component({
  selector: "app-error-handler",
  template: `
    <ng-container *ngIf="error">
      <div [ngSwitch]="error.status">
        <h1>
          <ng-container *ngSwitchCase="apiReturnCodes.unauthorized">
            Unauthorized access
          </ng-container>
          <ng-container *ngSwitchCase="apiReturnCodes.notFound">
            Not Found
          </ng-container>
          <ng-container *ngSwitchDefault>Unknown Error</ng-container>
        </h1>
      </div>

      <p *ngIf="error">{{ error.message }}</p>
    </ng-container>
  `
})
export class ErrorHandlerComponent extends WithUnsubscribe() implements OnInit {
  /**
   * Deprecated input
   */
  @Input() error: ApiErrorDetails;
  public apiReturnCodes = apiReturnCodes;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
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
    const resolvers: Resolvers = {};
    const categories: Category[] = [];

    // Scale category parents and add in reverse order (this is to preserve any overwrites)
    let category = data.category;
    while (category) {
      categories.push(category);
      category = category.parent;
    }
    for (let i = categories.length - 1; i >= 0; i--) {
      if (categories[i].resolvers) {
        Object.assign(resolvers, categories[i].resolvers);
      }
    }

    // Add final custom resolvers
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
