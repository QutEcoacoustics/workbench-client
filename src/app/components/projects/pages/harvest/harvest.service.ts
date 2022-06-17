import { Injectable } from "@angular/core";
import { HarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { NOT_FOUND, UNAUTHORIZED } from "http-status";
import { isIndexed } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  catchError,
  filter,
  interval,
  map,
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
  public error: BawApiError;
  public stage: HarvestStatus;

  private _harvest$ = new BehaviorSubject<Harvest | null>(null);
  private _harvestItems$ = new BehaviorSubject<HarvestItem[]>([]);
  private harvestTrigger$ = new Subject<void>();
  private harvestInterval: Subscription;

  public constructor(
    private notifications: ToastrService,
    private harvestApi: HarvestsService,
    private harvestItemsApi: HarvestItemsService
  ) {
    super();

    this.harvestTrigger$
      .pipe(
        switchMap(() => {
          if (this.harvest) {
            // Show requests are faster, use them when we know the harvest id
            return this.harvestApi.show(this.harvest, this.project);
          } else {
            // Otherwise, filter for the latest harvest
            return this.getCurrentHarvestId(this.project);
          }
        }),
        catchError((err: BawApiError) => {
          if ([UNAUTHORIZED, NOT_FOUND].includes(err.status)) {
            this.error = err;
          } else {
            this.notifications.error(
              "Failed to load harvest data, refresh this page to reconnect",
              undefined,
              { disableTimeOut: true }
            );
          }

          return throwError(() => err);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvest): void => {
        console.log("Harvest", harvest);
        if (!harvest) {
          this.setStage("new_harvest");
        } else {
          this.setStage(harvest.status);
          this._harvest$.next(harvest);
        }
      });

    this.harvestTrigger$
      .pipe(
        filter(() => isInstantiated(this.harvest)),
        switchMap(() => this.harvestItemsApi.list(this.project, this.harvest)),
        catchError(() => of([])),
        takeUntil(this.unsubscribe)
      )
      .subscribe((harvestItems) => {
        console.log("Harvest Items", harvestItems);
        this._harvestItems$.next(harvestItems);
      });
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

  public get numStages(): number {
    return this.harvest?.streaming ? 3 : 7;
  }

  public get currentStage(): number {
    switch (this.stage) {
      case "new_harvest":
        return 0;
      case "uploading":
        return 1;
      case "scanning":
        return 2;
      case "metadata_extraction":
        return 3;
      case "metadata_review":
        return 4;
      case "processing":
        return 5;
      case "complete":
        return this.harvest?.streaming ? 2 : 6;
      default:
        return 0;
    }
  }

  public initialize(project: Project): void {
    this.project = project;
    this._harvest$ = new BehaviorSubject<Harvest | null>(null);
    this._harvestItems$ = new BehaviorSubject<HarvestItem[]>([]);
    this.setStage("new_harvest");
    this.reloadModel();
  }

  public trackHarvest(harvest: Harvest): void {
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

  public startPolling(intervalMs: number): void {
    this.harvestInterval = interval(intervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.reloadModel();
      });
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
        this.reloadModel();
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
    const progress = (numItems / this.harvest.report.itemsTotal) * 100;
    if (progress < 1 && progress !== 0) {
      return 1;
    }
    return Math.floor(progress);
  }

  private setStage(stage: HarvestStatus): void {
    if (stage === this.stage) {
      return;
    }
    this.stopPolling();
    this.stage = stage;
  }

  private getCurrentHarvestId(project: Project): Observable<Harvest | null> {
    return this.harvestApi
      .filter(
        {
          sorting: { orderBy: "createdAt", direction: "desc" },
          filter: { status: { notEq: "complete" } },
        },
        project
      )
      .pipe(map((harvests) => harvests[0] ?? null));
  }
}
