import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import {
  harvestsCategory,
  harvestsMenuItem,
  newHarvestMenuItem,
} from "@components/harvest/harvest.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { BehaviorSubject, catchError, takeUntil, throwError } from "rxjs";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";
import { WidgetMenuItem } from "@menu/widgetItem";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { ToastService } from "@services/toasts/toasts.service";
import { ConfirmationComponent } from "../../components/modal/confirmation.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

export const harvestsMenuItemActions = [newHarvestMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-harvests",
  templateUrl: "./list.component.html",
  imports: [
    StrongRouteDirective,
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    DatetimeComponent,
    UserLinkComponent,
    LoadingComponent,
    UrlDirective,
    ConfirmationComponent,
    IsUnresolvedPipe,
  ],
})
class HarvestListComponent extends PageComponent implements OnInit {
  private readonly modals = inject(NgbModal);
  private readonly harvestsApi = inject(ShallowHarvestsService);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(ToastService);

  public contactUs = contactUsMenuItem;
  public filters$: BehaviorSubject<Filters<Harvest>>;
  public canCreateHarvestCapability: boolean;

  // this is in a getter so that we can override it in the AllUploadsComponent
  public get project(): Project {
    return this.route.snapshot.data[projectKey].model;
  }

  public ngOnInit(): void {
    this.canCreateHarvestCapability = this.project?.can("createHarvest")?.can;

    // we cannot use the project.id directly in the filter because
    // if the project is null, then the filter will be { projectId: null }
    // this will cause nothing to return because every harvest should have a projectId
    const filterByProject: Filters<Harvest> = { filter: { projectId: { eq: this.project?.id } } };
    const projectScopeFilter: Filters<Harvest> = this.project ? filterByProject : {};

    // A BehaviorSubject is need on filters$ to update the ngx-datatable harvest list & models
    // The this.filters$ is triggered in abortUpload()
    this.filters$ = new BehaviorSubject({
      sorting: {
        direction: "desc",
        orderBy: "createdAt",
      },
      // projection allows us only to emit the fields that we want
      // this improves performance and reduces the amount of data sent
      projection: {
        include: [
          "id",
          "projectId",
          "name",
          "createdAt",
          "creatorId",
          "streaming",
          "status",
        ],
      },
      ...projectScopeFilter,
    });
  }

  public async abortUpload(template: any, harvest: Harvest): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.harvestsApi
        .transitionStatus(harvest, "complete")
        .pipe(
          catchError((err: BawApiError) => {
            if (err.status !== CLIENT_TIMEOUT) {
              return throwError(() => err);
            }
          })
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (): void => {
            this.filters$.next({});
          },
          error: (err: BawApiError): void => {
            this.notifications.error(err.message);
          },
        });
    }
  }

  public getModels = (filters: Filters<Harvest>) =>
    this.harvestsApi.filter(filters);

  public asHarvest(model: any): Harvest {
    return model;
  }
}

HarvestListComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List(harvestsMenuItemActions),
    actionWidgets: List([
      new WidgetMenuItem(WebsiteStatusWarningComponent, undefined, {
        feature: "isUploadingHealthy",
        message: `
          Uploading is temporarily unavailable.
          Please try again later.
        `,
      }),
    ]),
  },
  pageRoute: harvestsMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { HarvestListComponent };
