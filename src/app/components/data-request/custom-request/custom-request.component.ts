import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DataRequest,
  DataRequestService,
  IDataRequest,
} from "@baw-api/data-request/data-request.service";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { fields } from "./custom-request.schema.json";

@Component({
  selector: "baw-request-custom",
  template: `
    <baw-form
      title="Custom Data Request"
      submitLabel="Submit"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      [recaptchaSeed]="recaptchaSeed"
      (onSubmit)="submit($event)"
    >
      <span id="subTitle">
        Use this form to request a customized annotations list or other data
        related to the audio recordings on this website.<br />
        You <strong>do not need</strong> to use this form if you need the
        standard <strong>annotations CSV</strong> download.
      </span>
    </baw-form>
  `,
})
export class CustomRequestComponent
  extends SimpleFormTemplate<DataRequest>
  implements OnInit {
  public fields = fields;

  public constructor(
    private api: DataRequestService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, () => "TODO", defaultErrorMsg, false);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.api
      .seed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ({ seed, action }) =>
          (this.recaptchaSeed = { state: "loaded", seed, action }),
        (err) => {
          console.error(err);
          this.notifications.error("Failed to load form");
        }
      );
  }

  protected apiAction(model: IDataRequest): Observable<void> {
    return this.api.dataRequest(new DataRequest(model));
  }
}
