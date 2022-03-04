import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/permissions-shield.component";
import { Project } from "@models/Project";
import { ResolvedModel } from "@services/baw-api/resolver-common";
import filesize from "filesize";
import { List } from "immutable";
import { Observable, Subscription, timer } from "rxjs";
import { map, startWith, takeUntil, takeWhile } from "rxjs/operators";
import { harvestProjectMenuItem, projectCategory } from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Component({
  selector: "baw-harvest",
  templateUrl: "./harvest.component.html",
  styleUrls: ["./harvest.component.scss"],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
class HarvestComponent extends PageComponent implements OnInit {
  public failure: boolean;
  public filesize = filesize;
  public progress: number;
  public project: Project;
  public stage: number;
  public stages: {
    previous: { text?: string; disabled?: boolean };
    next: { text?: string; disabled?: boolean };
    timer: { enable: boolean; callback?: () => void };
  }[] = [
    { previous: {}, next: { text: "Start" }, timer: { enable: false } },
    {
      previous: { text: "Cancel" },
      next: { text: "Finished Uploading" },
      timer: { enable: true },
    },
    {
      previous: {},
      next: {},
      timer: {
        enable: true,
        callback: () => {
          this.nextStage();
        },
      },
    },
    {
      previous: { text: "Re-submit Files" },
      next: { text: "Finish Review" },
      timer: { enable: false },
    },
    {
      previous: {},
      next: {},
      timer: {
        enable: true,
        callback: () => {
          this.nextStage();
        },
      },
    },
    { previous: {}, next: {}, timer: { enable: false } },
  ];
  public steps = {
    start: 0,
    credentials: 1,
    check: 2,
    review: 3,
    harvest: 4,
    summary: 5,
  };
  public harvestSteps = [
    { label: "Start" },
    { label: "Credentials" },
    { label: "Check" },
    { label: "Review" },
    { label: "Harvest" },
    { label: "Summary" },
  ];
  private intervalSpeed = 300;

  private subscription: Subscription;
  private mockTimer: Observable<number> = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    map((v) => {
      this.progress = v;
      return this.progress;
    }),
    takeWhile(() => this.progress < 100)
  );

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const resolvedProject: ResolvedModel<Project> =
      this.route.snapshot.data[projectKey];

    if (resolvedProject.error) {
      this.failure = true;
      return;
    }

    this.project = resolvedProject.model;
    this.stage = 0;
  }

  public nextStage() {
    this.stage++;
    this.harvestObs();
  }

  public previousStage() {
    // Review page should go to Credentials
    if (this.stage === this.steps.review) {
      this.stage = this.steps.credentials;
    } else {
      this.stage--;
    }

    this.harvestObs();
  }

  private harvestObs() {
    const mockTimer = this.stages[this.stage].timer;
    if (mockTimer.enable) {
      this.subscription?.unsubscribe();
      this.subscription = this.mockTimer
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          () => {},
          () => {},
          mockTimer.callback ? mockTimer.callback : () => {}
        );
    }
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
