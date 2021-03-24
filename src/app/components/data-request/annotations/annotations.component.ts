import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  defaultErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { fields } from "./download-annotations.schema.json";

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
export class AnnotationsComponent extends FormTemplate<any> implements OnInit {
  public fields = fields;

  public constructor(
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      undefined,
      () => "TODO",
      defaultErrorMsg,
      false
    );
  }

  protected apiAction(model: Partial<any>): Observable<any> {
    throw new Error("Method not implemented.");
  }

  protected redirectUser() {
    // Do nothing
  }
}
