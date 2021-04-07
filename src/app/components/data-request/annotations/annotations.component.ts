import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiShow } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { KeysOfType } from "@helpers/advancedTypes";
import {
  defaultErrorMsg,
  SimpleFormTemplate,
} from "@helpers/formTemplate/simpleFormTemplate";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
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
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    >
      <span id="subTitle">
        Please select the timezone for the CSV file containing annotations for
        <baw-loading
          *ngIf="!modelName"
          class="d-inline-block"
          size="sm"
        ></baw-loading>
        <ng-container *ngIf="modelName">{{ modelName }}</ng-container>
      </span>
    </baw-form>
  `,
})
export class AnnotationsComponent
  extends SimpleFormTemplate<Model>
  implements OnInit {
  public fields = fields;
  public modelName: string;

  public constructor(
    private accountsApi: AccountsService,
    private projectsApi: ProjectsService,
    private regionsApi: ShallowRegionsService,
    private sitesApi: ShallowSitesService,
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

  public async ngOnInit() {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    const {
      userId,
      projectId,
      regionId,
      siteId,
      timezoneName,
    } = this.route.snapshot.queryParams;

    if (isInstantiated(userId)) {
      this.retrieveUser(userId);
    } else if (isInstantiated(projectId)) {
      this.retrieveProject(projectId);
    } else if (isInstantiated(regionId)) {
      this.retrieveRegion(regionId);
    } else if (isInstantiated(siteId)) {
      this.retrieveSite(siteId);
    }

    if (timezoneName) {
    }
  }

  protected apiAction(model: Partial<Model>): Observable<void | Model> {
    throw new Error("Method not implemented.");
  }

  private retrieveUser(id: number) {
    this.retrieveModel<User, AccountsService>(this.accountsApi, id, "userName");
  }

  private retrieveProject(id: number) {
    this.retrieveModel<Project, ProjectsService>(this.projectsApi, id, "name");
  }

  private retrieveRegion(id: number) {
    this.retrieveModel<Region, ShallowRegionsService>(
      this.regionsApi,
      id,
      "name"
    );
  }

  private retrieveSite(id: number) {
    this.retrieveModel<Site, ShallowSitesService>(this.sitesApi, id, "name");
  }

  private retrieveModel<M extends AbstractModel, S extends ApiShow<M>>(
    api: S,
    id: number,
    key: KeysOfType<M, string>
  ) {
    api
      .show(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (model) => (this.modelName = (model[key] as unknown) as string),
        (err: ApiErrorDetails) => this.notifications.error(err.message)
      );
  }
}

interface Model {
  timezone: string;
}
