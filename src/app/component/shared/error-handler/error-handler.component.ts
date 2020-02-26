import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PageInfoInterface } from "src/app/helpers/page/pageInfo";
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
export class ErrorHandlerComponent implements OnInit, OnDestroy {
  @Input() error: ApiErrorDetails;
  public apiReturnCodes = apiReturnCodes;
  private unsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: PageInfoInterface) => {
        const resolvers = data.category.resolvedModels;

        if (!resolvers) {
          return;
        }

        // Find any error messages
        for (const resolver of resolvers) {
          if (!data[resolver].error) {
            continue;
          }

          this.error = data[resolver].error as ApiErrorDetails;
          // If unauthorized response, no point downgrading to "Not Found"
          if (this.error.status === apiReturnCodes.unauthorized) {
            return;
          }
        }
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
