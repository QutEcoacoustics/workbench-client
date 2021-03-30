import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
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
  extends SimpleFormTemplate<Model>
  implements OnInit {
  public fields = fields;

  public constructor(
    private accountsApi: AccountsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      () =>
        "Successfully downloaded annotations. Please accept pop-ups if they are disabled.",
      defaultErrorMsg,
      false
    );
  }

  protected apiAction(model: Partial<Model>): Observable<void> {
    return this.accountsApi.downloadAnnotations(model.timezone);
  }
}

interface Model {
  timezone: string;
}
