import { Injectable, OnDestroy } from "@angular/core";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";
import { HarvestItemsService } from "@baw-api/harvest/harvest-items.service";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { HarvestItem, ValidationName } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { Step } from "@shared/stepper/stepper.component";
import { Map } from "immutable";
import { ToastrService } from "ngx-toastr";
import {
  BehaviorSubject,
  catchError,
  delay,
  filter,
  first,
  firstValueFrom,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  throwError
} from "rxjs";

@Injectable({ providedIn: "root" })
export class HarvestStagesService implements OnDestroy {
  public project: Project;
  /**
   * If true, state of harvest is in transition, and buttons to transition
   * state should be disabled
   */
  public transitioningStage: boolean;
  /** Harvest items errors. If true, the error is fixable */
  public harvestItemErrors: Map<ValidationName, boolean> = Map();
  public hasHarvestItemsFixable: boolean;
  public hasHarvestItemsNotFixable: boolean;

  private _harvest$ = new BehaviorSubject<Harvest | null>(null);
  private harvestTrigger$ = new Subject<void>();
  private harvestInterval: Subscription;
  private unsubscribe = new Subject<void>();

  public constructor(
    private notifications: ToastrService,
    private harvestApi: HarvestsService,
    private harvestItemApi: HarvestItemsService
  ) {
    this.trackHarvest();
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.unsubscribe.complete();
  }

  public get harvest$(): Observable<Harvest | null> {
    return this._harvest$.asObservable();
  }

  public get harvest(): Harvest | null {
    return this._harvest$.value;
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

  public get stage(): HarvestStatus {
    return this.harvest?.status ?? "newHarvest";
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

  /**
   * Initialize this service, and reset any relevant fields
   *
   * @param project Current harvests project
   * @param harvest Current harvest
   */
  public initialize(project: Project, harvest: Harvest): void {
    this.project = project;
    this.setHarvest(harvest);
    this.harvestItemErrors = Map();
    this.stopPolling();
  }

  /** Destroy the current  */
  public destroy(): void {
    this.project = null;
    this._harvest$ = new BehaviorSubject<Harvest | null>(null);
    this.harvestItemErrors = Map();
    this.stopPolling();
    this.unsubscribe.next();
  }

  /** Manually set the harvest model */
  public setHarvest(harvest: Harvest): void {
    this._harvest$.next(harvest);
  }

  /** Forcefully reload the harvest model */
  public reloadModel(): void {
    if (!this.project) {
      console.error("Must initialize the service first");
      return;
    }
    this.harvestTrigger$?.next();
  }

  /**
   * Start polling for changes to the harvest model
   *
   * @param intervalMs How often to poll for the latest harvest
   */
  public startPolling(intervalMs: number): void {
    this.harvestInterval = interval(intervalMs)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((): void => this.reloadModel());
  }

  /**
   * Stop polling for changes to the harvest model
   */
  public stopPolling(): void {
    this.harvestInterval?.unsubscribe();
  }

  /**
   * Asynchronously retrieve harvest items for either the root folder, or the
   * children of a harvest item
   *
   * @param harvestItem Parent harvest item to retrieve items from
   * @param page Page number of request
   */
  public async getHarvestItems(
    harvestItem: HarvestItem | null,
    page: number
  ): Promise<HarvestItem[]> {
    /** Extract all validation errors, and track them in harvestItemErrors */
    const extractHarvestItemErrors = (items: HarvestItem[]): void => {
      this.harvestItemErrors = this.harvestItemErrors.withMutations(
        (list): void => {
          items.forEach((_item: HarvestItem): void => {
            _item.validations?.forEach((validation): void => {
              list = list.set(validation.name, true);

              if (validation.status === "fixable") {
                this.hasHarvestItemsFixable = true;
              } else {
                this.hasHarvestItemsNotFixable = true;
              }
            });
          });
        }
      );
    };

    try {
      return firstValueFrom(
        this.harvestItemApi
          .listByPage(page, this.project, this.harvest, harvestItem)
          .pipe(
            first(),
            tap(extractHarvestItemErrors),
            takeUntil(this.unsubscribe)
          )
      );
    } catch (err: any) {
      console.error(err);
      this.notifications.error(
        `Failed to load the contents of ${harvestItem?.path ?? ""}`
      );
      return [];
    }
  }

  /**
   * Transition the stage of this harvest
   *
   * @param stage Stage to transition to
   */
  public transition(stage: HarvestStatus): void {
    this.transitioningStage = true;

    // We want this api request to complete regardless of lifecycle destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi
      .transitionStatus(this.harvest, stage)
      .pipe(
        catchError((err: BawApiError) => {
          if (err.status !== CLIENT_TIMEOUT) {
            return throwError(() => err);
          }

          const delaySeconds = 5;
          this.notifications.info(
            `Attempting to reload page in ${delaySeconds} seconds`
          );
          // Just in case, check if the transition was successful. Long
          // transitions can cause timeouts
          of(null).pipe(
            delay(delaySeconds * 1000),
            tap((): void => this.harvestTrigger$?.next())
          );
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (harvest): void => {
          this.setHarvest(harvest);
          this.stopPolling();
          this.harvestItemErrors = Map();
          this.transitioningStage = false;
        },
        error: (err: BawApiError): void => {
          this.notifications.error(err.message);
          this.transitioningStage = false;
        },
      });
  }

  public isCurrentStage(stage: HarvestStatus): boolean {
    return this.stage === stage;
  }

  public calculateProgress(numItems: number): number {
    if (this.harvest.report.itemsTotal === 0) {
      return 0;
    }

    const progress = ((numItems ?? 0) / this.harvest.report.itemsTotal) * 100;
    const almostDone = progress > 99.99 && progress !== 100;
    return almostDone ? 99.99 : +progress.toFixed(2);
  }

  /**
   * Retrieve the latest version of the harvest whenever harvestTrigger is
   * triggered
   */
  private trackHarvest(): void {
    this.harvestTrigger$
      .pipe(
        filter((): boolean => isInstantiated(this.harvest)),
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
}
