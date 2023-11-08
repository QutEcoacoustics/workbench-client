import { Component, OnInit } from "@angular/core";
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
import { DateTime } from "luxon";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { BehaviorSubject, catchError, takeUntil, throwError } from "rxjs";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";

export const harvestsMenuItemActions = [newHarvestMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-harvests",
  templateUrl: "list.component.html",
})
class ListComponent extends PageComponent implements OnInit {
  public contactUs = contactUsMenuItem;
  public filters$: BehaviorSubject<Filters<Harvest>>;
  public canCreateHarvestCapability: boolean;

  public constructor(
    public modals: NgbModal,
    private harvestsApi: ShallowHarvestsService,
    private route: ActivatedRoute
  ) {
    super();
  }

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

  public formatDate(date: DateTime): string {
    return date.toLocal().toFormat("yyyy-MM-dd HH:mm:ss");
  }
}

ListComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List(harvestsMenuItemActions),
  },
  pageRoute: harvestsMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { ListComponent };
