import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import {
  harvestsCategory,
  harvestsMenuItem,
  newHarvestMenuItem,
} from "@components/harvest/harvest.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { DateTime } from "luxon";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import {
  BehaviorSubject,
  catchError,
  takeUntil,
  throwError
} from "rxjs";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";

export const harvestsMenuItemActions = [newHarvestMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-harvests",
  templateUrl: "list.component.html",
})
class ListComponent extends PageComponent implements OnInit {
  public contactUs = contactUsMenuItem;
  public project: Project;
  public filters$: BehaviorSubject<Filters<Harvest>>;
  public canCreateHarvestCapability: boolean;

  public constructor(
    public modals: NgbModal,
    private harvestsApi: HarvestsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
    this.canCreateHarvestCapability = this.project.can("createHarvest").can;
    // A BehaviorSubject is need on fitlers$ to update the ngx-datatable harvest list & models
    // The this.filters$ is triggered in abortUpload()
    this.filters$ = new BehaviorSubject({
      sorting: {
        direction: "desc",
        orderBy: "createdAt",
      }
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
    this.harvestsApi.filter(filters, this.project);

  public asHarvest(model: any): Harvest {
    return model;
  }

  public formatDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd HH:mm:ss");
  }
}

ListComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List(harvestsMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  pageRoute: harvestsMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { ListComponent };
