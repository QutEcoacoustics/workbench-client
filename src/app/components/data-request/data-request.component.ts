import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiShow } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { takeUntil } from "rxjs/operators";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";

@Component({
  selector: "baw-data-request",
  template: `
    <!-- Display content if there is no errors -->
    <ng-container *ngIf="!error">
      <h1>Data Request</h1>

      <!-- Display forms if all loading completed -->
      <ng-container *ngIf="!loadingModel && !loadingProject && !error">
        <h2 class="text-center">Annotations Download</h2>
        <ng-container *ngIf="canRequestAnnotations; else placeholder">
          <baw-request-annotations
            [model]="model"
            [project]="project"
            [modelName]="modelName"
          ></baw-request-annotations>
        </ng-container>

        <baw-request-custom></baw-request-custom>
      </ng-container>
    </ng-container>

    <!-- Template placeholder for how to request annotations -->
    <ng-template #placeholder>
      <p>To download a standard CSV of annotations</p>
      <ol>
        <li>Navigate to the project you're interested in</li>
        <li>Then, choose the site you want to download annotations for</li>
        <li>Finally, click the <i>Download annotations</i> link</li>
      </ol>
    </ng-template>

    <!-- Display error if exists -->
    <ng-container *ngIf="error">
      <baw-error-handler [error]="error"></baw-error-handler>
    </ng-container>

    <!-- Display spinner if loading -->
    <ng-container *ngIf="loadingModel || loadingProject">
      <baw-loading></baw-loading>
    </ng-container>
  `,
  styles: [
    `
      h2 {
        margin: 0;
        padding: 30px 0;
        font-size: 34px;
      }
    `,
  ],
})
class DataRequestComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit {
  public canRequestAnnotations = false;
  public error: ApiErrorDetails;
  public loadingModel = false;
  public loadingProject = false;
  public model: AbstractModel;
  public modelName: string;
  public project: Project;

  public constructor(
    private accountsApi: AccountsService,
    private projectsApi: ProjectsService,
    private regionsApi: ShallowRegionsService,
    private sitesApi: ShallowSitesService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    const {
      userId,
      projectId,
      regionId,
      siteId,
    } = this.route.snapshot.queryParams;
    const hasModel =
      isInstantiated(userId) ||
      // Project is required to use site or region
      (isInstantiated(projectId) &&
        (isInstantiated(siteId) || isInstantiated(regionId)));

    if (!hasModel) {
      return;
    }

    this.canRequestAnnotations = true;
    this.loadingModel = true;

    if (isInstantiated(userId)) {
      this.retrieveUser(userId);
    } else {
      this.loadingProject = true;
      this.retrieveProject(projectId);

      if (isInstantiated(siteId)) {
        this.retrieveSite(siteId);
      } else {
        this.retrieveRegion(regionId);
      }
    }
  }

  private retrieveUser(id: number) {
    this.retrieveModel<User, AccountsService>(this.accountsApi, id, (model) => {
      this.model = model;
      this.modelName = model.userName;
      this.loadingModel = false;
    });
  }

  private retrieveProject(id: number) {
    this.retrieveModel<Project, ProjectsService>(
      this.projectsApi,
      id,
      (model) => {
        this.project = model;
        this.loadingProject = false;
      }
    );
  }

  private retrieveRegion(id: number) {
    this.retrieveModel<Region, ShallowRegionsService>(
      this.regionsApi,
      id,
      (model) => {
        this.model = model;
        this.modelName = model.name;
        this.loadingModel = false;
      }
    );
  }

  private retrieveSite(id: number) {
    this.retrieveModel<Site, ShallowSitesService>(
      this.sitesApi,
      id,
      (model) => {
        this.model = model;
        this.modelName = model.name;
        this.loadingModel = false;
      }
    );
  }

  private retrieveModel<M extends AbstractModel, S extends ApiShow<M>>(
    api: S,
    id: number,
    assignModel: (model: M) => void
  ) {
    api
      .show(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (model) => {
          assignModel(model);
        },
        (err: ApiErrorDetails) => {
          this.loadingModel = false;
          this.error = err;
        }
      );
  }
}

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
