import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  catchError,
  filter,
  interval,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  throwError,
} from "rxjs";
import { harvestProjectMenuItem, projectCategory } from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

// TODO Rename these so they match JS standards
export enum HarvestStage {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  new_harvest,
  uploading,
  scanning,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  metadata_extraction,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  metadata_review,
  processing,
  review,
  complete,
}

const projectKey = "project";

@Component({
  selector: "baw-harvest",
  templateUrl: "./harvest.component.html",
})
class HarvestComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public project: Project;

  public harvest: Harvest;
  public harvestTrigger$ = new Subject<void>();
  public harvestInterval: Subscription;

  public stage: HarvestStage = HarvestStage.new_harvest;
  public harvestStage = HarvestStage;
  public isStreaming: boolean;

  public constructor(
    private notifications: ToastrService,
    private route: ActivatedRoute,
    private harvestApi: HarvestsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
    this.harvestTrigger$
      .pipe(
        switchMap(() => this.harvestApi.currentHarvest(this.project)),
        catchError((err: BawApiError) => {
          this.notifications.error(
            "Failed to load harvest data, refresh this page to reconnect",
            undefined,
            { disableTimeOut: true }
          );
          return throwError(() => err);
        }),
        filter((harvest) => isInstantiated(harvest)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvest): void => {
        console.log(harvest);
        this.harvest = harvest;
        this.stage = HarvestStage[harvest.status];
      });

    this.reloadModel();
  }

  public setStage(stage: HarvestStage): void {
    this.stopPolling();
    this.reloadModel();
    this.stage = stage;
  }

  public reloadModel(): void {
    this.harvestTrigger$.next();
  }

  public startPolling = (intervalMs: number = 1000): void => {
    this.harvestInterval = interval(intervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((): void => this.reloadModel());
  };

  public stopPolling = (): void => {
    this.harvestInterval?.unsubscribe();
  };
}

HarvestComponent.linkToRoute({
  category: projectCategory,
  pageRoute: harvestProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { HarvestComponent };
