import { Component, OnInit } from "@angular/core";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { toRelative } from "@interfaces/apiInterfaces";
import { Harvest, HarvestMapping, HarvestStatus } from "@models/Harvest";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Duration } from "luxon";
import { ToastrService } from "ngx-toastr";

// TODO Show additional information to users if itemsError is non zero. Ie:
// An unexpected error occurred in xxx files. Please contact us so we can investigate the issue.
// You can choose to continue the harvest, but any files that produced errors will be ignored

@Component({
  selector: "baw-harvest-metadata-review",
  templateUrl: "metadata-review.component.html",
  styleUrls: ["metadata-review.component.scss"],
})
export class MetadataReviewComponent
  extends withUnsubscribe()
  implements OnInit, UnsavedInputCheckingComponent
{
  public mappings: HarvestMapping[];
  public loading: boolean;
  public hasUnsavedChanges: boolean;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public siteColumnLabel: string;

  public constructor(
    private stages: HarvestStagesService,
    private config: ConfigService,
    private notification: ToastrService,
    private harvestApi: ShallowHarvestsService
  ) {
    super();
  }

  public get project(): Project {
    return this.stages.project;
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public ngOnInit(): void {
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
    this.mappings = this.harvest.mappings;
  }

  public humanizeDuration(duration: Duration): string {
    return toRelative(duration, { largest: 1, maxDecimalPoint: 0 });
  }

  public onNextClick(): void {
    this.transition("processing");
  }

  public onBackClick(): void {
    this.transition("uploading");
  }

  public onSaveClick(): void {
    this.transition("metadataExtraction");
  }

  private transition(stage: HarvestStatus): void {
    this.loading = true;
    this.stages.transition(stage, () => (this.loading = false));
  }

  public setSite(mapping: HarvestMapping, siteId: number) {
    mapping.siteId = siteId;
    this.updateHarvestWithMappingChange();
  }

  public setOffset(mapping: HarvestMapping, offset: string) {
    mapping.utcOffset = offset;
    this.updateHarvestWithMappingChange();
  }

  private updateHarvestWithMappingChange(): void {
    this.hasUnsavedChanges = true;
    this.harvestApi
      .updateMappings(this.harvest, this.mappings)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        next: () => this.stages.reloadModel(),
        error: (err: BawApiError) =>
          this.notification.error("Failed to make that change: " + err.message),
      });
  }
}
