import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import {
  filter,
  interval,
  Observable,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from "rxjs";
import { harvestProjectMenuItem, projectCategory } from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

export enum HarvestStage {
  newHarvest,
  uploading,
  scanning,
  metadataExtraction,
  metadataReview,
  processing,
  review,
  complete,
}

export type UploadType = "batch" | "stream";

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

  public harvest$: Observable<Harvest | undefined>;
  public harvestTrigger$ = new Subject<void>();
  public harvestInterval: Subscription;

  public stage: HarvestStage = HarvestStage.newHarvest;
  public harvestStage = HarvestStage;
  public isStreaming: boolean;

  public constructor(
    private route: ActivatedRoute,
    private harvestApi: HarvestsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
    this.harvest$ = this.harvestTrigger$.pipe(
      switchMap(() => this.harvestApi.currentHarvest(this.project))
    );

    this.harvest$
      .pipe(
        filter((harvest) => isInstantiated(harvest)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvest): void => {
        console.log(harvest);
        this.stage = HarvestStage[harvest.status];
      });

    this.reloadModel();
  }

  public setStage(stage: HarvestStage): void {
    this.reloadModel();
    this.stage = stage;
  }

  public setType(stage: UploadType): void {
    this.isStreaming = stage === "stream";
  }

  public reloadModel(): void {
    this.harvestTrigger$.next();
  }

  public startPolling(intervalMs: number = 1000): void {
    this.harvestInterval = interval(intervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((): void => this.reloadModel());
  }

  public stopPolling(): void {
    this.harvestInterval.unsubscribe();
  }
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
