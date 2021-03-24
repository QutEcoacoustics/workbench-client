import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormTemplate,
  defaultErrorMsg,
} from "@helpers/formTemplate/formTemplate";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { fields } from "./custom-request.schema.json";

@Component({
  selector: "baw-request-custom",
  template: `
    <baw-form
      title="Custom Data Request"
      subTitle="
        Use this form to request a customized annotations list or other data related to the
        audio recordings on this website. You <strong>do not need</strong> to use this form
        if you need the standard <strong>annotations CSV</strong> download.
      "
      submitLabel="Submit"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
export class CustomRequestComponent
  extends FormTemplate<any>
  implements OnInit {
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
