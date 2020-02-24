import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit
} from "@angular/core";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { apiReturnCodes } from "src/app/services/baw-api/baw-api.service";
import { ActivatedRoute } from "@angular/router";
import { PageInfoInterface } from "src/app/helpers/page/pageInfo";

@Component({
  selector: "app-error-handler",
  template: `
    <ng-container *ngIf="error">
      <ng-container *ngIf="display === 'unauthorized'">
        <h1>Unauthorized access</h1>
      </ng-container>
      <ng-container *ngIf="display === 'notFound'">
        <h1>Not found</h1>
      </ng-container>
      <ng-container *ngIf="display === 'forbidden'">
        <h1>Forbidden</h1>
      </ng-container>
      <ng-container *ngIf="display === 'unknown'">
        <h1>Unknown Error</h1>
      </ng-container>

      <p *ngIf="error">{{ error.message }}</p>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlerComponent implements OnInit, OnChanges {
  @Input() error: ApiErrorDetails;
  display = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: PageInfoInterface) => {
      const resolvers = data.category.resolvedModels;

      if (!resolvers) {
        return;
      }

      for (const resolver of resolvers) {
        if (data[resolver].error) {
          console.log("Model Error: ", resolver, data[resolver]);
          this.error = data[resolver].error as ApiErrorDetails;
        }
      }
    });

    this.evaluateError();
  }

  ngOnChanges() {
    this.evaluateError();
  }

  evaluateError() {
    if (!this.error?.status && this.error?.status !== 0) {
      this.display = "";
      return;
    }

    switch (this.error.status) {
      case apiReturnCodes.unauthorized:
        this.display = "unauthorized";
        break;

      case apiReturnCodes.notFound:
        this.display = "notFound";
        break;

      case apiReturnCodes.forbidden:
        this.display = "forbidden";
        break;

      default:
        this.display = "unknown";
        break;
    }
  }
}
