import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { fields } from "./annotations.schema.json";

@Component({
  selector: "baw-request-annotations",
  template: `
    <baw-form
      title="Annotations Download"
      subTitle="Please select the timezone for the CSV file containing annotations for ..."
      submitLabel="Download Annotations"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
export class AnnotationsComponent
  extends SimpleFormTemplate<{ timezone: string }>
  implements OnInit {
  public fields = fields;

  public constructor(
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, () => "TODO", defaultErrorMsg, false);
  }

  protected onSuccess(model: void | { timezone: string }): void {
    throw new Error("Method not implemented.");
  }
  protected apiAction(
    model: Partial<{ timezone: string }>
  ): Observable<void | { timezone: string }> {
    throw new Error("Method not implemented.");
  }
}
