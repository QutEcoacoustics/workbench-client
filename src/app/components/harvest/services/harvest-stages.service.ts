import { Injectable } from "@angular/core";
import { ShallowHarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { Step } from "@shared/stepper/stepper.component";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  catchError,
  filter,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  throwError,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class HarvestStagesService extends withUnsubscribe() {
  public project: Project;
  public stage: HarvestStatus;

  private _harvest$ = new BehaviorSubject<Harvest | null>(null);
  private _harvestItems$ = new BehaviorSubject<HarvestItem[]>([]);
  private harvestTrigger$ = new Subject<void>();
  private harvestInterval: Subscription;

  public constructor(
    private notifications: ToastrService,
    private harvestApi: HarvestsService,
    private harvestItemsApi: ShallowHarvestItemsService
  ) {
    super();
    this.trackHarvest();
    this.trackHarvestItems();
  }

  public get harvest$(): Observable<Harvest | null> {
    return this._harvest$.asObservable();
  }

  public get harvest(): Harvest | null {
    return this._harvest$.value;
  }

  public get harvestItems$(): Observable<HarvestItem[]> {
    return this._harvestItems$.asObservable();
  }

  public get harvestItems(): HarvestItem[] {
    return this._harvestItems$.value;
  }

  private _stages: Step[] = [
    { label: "New Upload", icon: ["fas", "plus"] },
    { label: "Uploading", icon: ["fas", "cloud-arrow-up"] },
    { label: "Scanning", icon: ["fas", "magnifying-glass"] },
    { label: "Extraction", icon: ["fas", "microscope"] },
    { label: "Review", icon: ["fas", "list-check"] },
    { label: "Processing", icon: ["fas", "arrows-spin"] },
    { label: "Complete", icon: ["fas", "flag-checkered"] },
  ];
  private _streamingStages: Step[] = [0, 1, 6].map(
    (step): Step => this._stages[step]
  );
  public get stages(): Step[] {
    return this.harvest?.streaming ? this._streamingStages : this._stages;
  }

  public get currentStage(): number {
    const temp: Record<HarvestStatus, number> = {
      newHarvest: 0,
      uploading: 1,
      scanning: 2,
      metadataExtraction: 3,
      metadataReview: 4,
      processing: 5,
      complete: this.harvest?.streaming ? 2 : 6,
    };
    return temp[this.stage];
  }

  public initialize(project: Project, harvest: Harvest): void {
    this.project = project;
    this.setHarvest(harvest);
  }

  private setHarvest(harvest: Harvest): void {
    this._harvest$.next(harvest);
    this.setStage(harvest.status);
  }

  public reloadModel(): void {
    if (!this.project) {
      console.error("Must initialize the service first");
      return;
    }
    this.harvestTrigger$?.next();
  }

  /**
   * Start polling for changes to the harvest model. intervalMs cannot be less
   * than the cache timeout
   */
  public startPolling(intervalMs: number): void {
    this.harvestInterval = interval(intervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.reloadModel());
  }

  public stopPolling(): void {
    this.harvestInterval?.unsubscribe();
  }

  public transition(
    stage: HarvestStatus,
    onComplete: (resp: Harvest | BawApiError) => void
  ): void {
    // We want this api request to complete regardless of lifecycle destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.transitionStatus(this.harvest, stage).subscribe({
      next: (harvest): void => {
        onComplete(harvest);
        this.setHarvest(harvest);
      },
      error: (err: BawApiError) => {
        onComplete(err);
        this.notifications.error(err.message);
      },
    });
  }

  public isCurrentStage(stage: HarvestStatus): boolean {
    return this.stage === stage;
  }

  public calculateProgress(numItems: number) {
    if (this.harvest.report.itemsTotal === 0) {
      return 0;
    }

    const progress = ((numItems ?? 0) / this.harvest.report.itemsTotal) * 100;
    const almostDone = progress > 99.99 && progress !== 100;
    return almostDone ? 99.99 : +progress.toFixed(2);
  }

  private setStage(stage: HarvestStatus): void {
    if (stage === this.stage) {
      return;
    }
    this.stopPolling();
    this.stage = stage;
  }

  private trackHarvest(): void {
    this.harvestTrigger$
      .pipe(
        filter(() => isInstantiated(this.harvest)),
        switchMap(
          (): Observable<Harvest> =>
            this.harvestApi.showWithoutCache(this.harvest, this.project)
        ),
        catchError((err: BawApiError) => {
          this.notifications.error(
            "Failed to load harvest data, refresh this page to reconnect",
            undefined,
            { disableTimeOut: true }
          );
          return throwError(() => err);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvest): void => {
        this.setHarvest(harvest);
      });
  }

  private trackHarvestItems(): void {
    const defaultResponse: Observable<HarvestItem[]> = of([]);
    this.harvest$
      .pipe(
        filter((): boolean => this.isCurrentStage("metadataReview")),
        switchMap((harvest) => this.harvestItemsApi.list(harvest)),
        catchError(() => defaultResponse),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvestItems): void => {
        this._harvestItems$.next(harvestItems);
      });
  }
}
