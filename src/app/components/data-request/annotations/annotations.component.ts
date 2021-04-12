import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { RegionsService } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { fields } from "./annotations.schema.json";

@Component({
  selector: "baw-request-annotations",
  template: `
    <baw-form
      submitLabel="Download Annotations"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    >
      <span id="subTitle">
        Please select the timezone for the CSV file containing annotations for
        {{ modelName }}
      </span>
    </baw-form>
  `,
})
export class AnnotationsComponent
  extends SimpleFormTemplate<Model>
  implements OnInit {
  public fields = fields;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input("model") public annotationModel: AbstractModel;
  @Input() public project: Project;
  @Input() public modelName: string;

  public constructor(
    private accountApi: AccountsService,
    private regionApi: RegionsService,
    private siteApi: SitesService,
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

  public ngOnInit() {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    const { timezoneName } = this.route.snapshot.queryParams;
    if (timezoneName) {
      this.model.timezone = timezoneName;
    }
  }

  protected apiAction(model: Partial<Model>): Observable<void> {
    if (!this.project) {
      return this.accountApi.downloadAnnotations(model.timezone);
    }

    const isRegion = (this.annotationModel as Region).kind === "Region";
    if (isRegion) {
      return this.regionApi.downloadAnnotations(
        this.annotationModel as Region,
        this.project,
        model.timezone
      );
    } else {
      return this.siteApi.downloadAnnotations(
        this.annotationModel as Site,
        this.project,
        model.timezone
      );
    }
  }
}

interface Model {
  timezone: string;
}
