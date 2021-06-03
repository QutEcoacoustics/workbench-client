import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataRequestService } from "@baw-api/data-request/data-request.service";
import { FormTemplate } from "@helpers/formTemplate/formTemplate";
import { DataRequest, IDataRequest } from "@models/data/DataRequest";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import { fields } from "./data-request.schema.json";

@Component({
  selector: "baw-data-request",
  template: `
    <h1>Data Request</h1>

    <h2>Annotations Download</h2>

    <p>To download a standard CSV of annotations</p>

    <ol>
      <li>Open the site or point page you're interested in</li>
      <li>
        Use the <i>Download Annotations</i> button to download annotations
      </li>
    </ol>

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
        <p>
          Use this form to request a customized annotations list or other data
          related to the audio recordings on this website.
        </p>
        <p>
          You <strong>do not need</strong> to use this form if you need the
          standard <strong>annotations CSV</strong> download.
        </p>
      </span>
    </baw-form>
  `,
})
class DataRequestComponent extends FormTemplate<DataRequest> implements OnInit {
  public fields = fields;

  public constructor(
    private api: DataRequestService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: () =>
        "Your request was successfully submitted. We will be in contact shortly.",
    });
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

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
