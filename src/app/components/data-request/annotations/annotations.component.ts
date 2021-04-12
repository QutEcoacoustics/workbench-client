import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { RegionsService } from "@baw-api/region/regions.service";
import { SitesService } from "@baw-api/site/sites.service";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { fields } from "./annotations.schema.json";

@Component({
  selector: "baw-request-annotations",
  template: `
    <baw-form
      submitLabel="Download Annotations"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading || failure"
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
  @Input() public user: User;
  @Input() public region: Region;
  @Input() public site: Site;
  public modelName: string;
  private project: Project;

  public constructor(
    private projectsApi: ProjectsService,
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

    const { timezoneName, projectId } = this.route.snapshot.queryParams;

    if (timezoneName) {
      this.model.timezone = timezoneName;
    }

    if (this.user) {
      this.modelName = this.user.userName;
      return;
    }

    if (this.region || this.site) {
      this.modelName = (this.region ?? this.site).name;
      this.loading = true;
      const id =
        projectId ??
        (this.region
          ? this.region.projectId
          : this.site.projectIds?.values()?.next()?.value);

      this.projectsApi
        .show(id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (project) => {
            this.project = project;
            this.loading = false;
          },
          (err: ApiErrorDetails) => {
            this.failure = true;
            this.loading = false;
            this.notifications.error(err.message);
          }
        );
    }
  }

  protected apiAction(model: Partial<Model>): Observable<void> {
    if (!this.project) {
      return this.accountApi.downloadAnnotations(model.timezone);
    }

    if (this.region) {
      return this.regionApi.downloadAnnotations(
        this.region,
        this.project,
        model.timezone
      );
    } else {
      return this.siteApi.downloadAnnotations(
        this.site,
        this.project,
        model.timezone
      );
    }
  }
}

interface Model {
  timezone: string;
}
