import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest, HarvestMapping, HarvestStatus } from "@models/Harvest";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "baw-harvest-metadata-review",
  template: `
    <h3>Review</h3>

    <p>This is a review of the audio data</p>

    <!-- Should use harvest items list instead of harvest mappings. This allows for us to open sub-directories, etc -->
    <ngx-datatable
      class="mb-3"
      bawDatatableDefaults
      [rows]="harvest.mappings"
      [externalPaging]="false"
      [externalSorting]="false"
    >
      <ngx-datatable-column prop="path">
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <!-- Enable overflow so that typeahead options will show -->
      <ngx-datatable-column
        prop="siteId"
        cellClass="overflow-visible"
        [width]="300"
        [maxWidth]="300"
      >
        <ng-template let-column="column" ngx-datatable-header-template>
          {{ siteColumnLabel }}
        </ng-template>
        <ng-template
          let-row="row"
          let-value="value"
          ngx-datatable-cell-template
        >
          <baw-loading
            *ngIf="row.site | isUnresolved; else siteSelector"
            size="sm"
          ></baw-loading>

          <ng-template #siteSelector>
            <baw-site-selector
              [project]="project"
              [site]="row.site"
              (siteIdChange)="setSite(row, $event)"
            ></baw-site-selector>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column prop="utcOffset" [width]="200" [maxWidth]="200">
        <ng-template let-column="column" ngx-datatable-header-template>
          UTC Offset
        </ng-template>
        <ng-template
          let-row="row"
          let-value="value"
          ngx-datatable-cell-template
        >
          <baw-utc-offset-selector
            [offset]="value"
            (offsetChange)="setOffset(row, $event)"
          ></baw-utc-offset-selector>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>

    <div class="d-flex justify-content-between">
      <button
        class="btn btn-outline-primary"
        [disabled]="loading"
        (click)="onBackClick()"
      >
        Upload more files
      </button>
      <button
        *ngIf="harvest.isMappingsDirty"
        class="btn btn-primary"
        [disabled]="loading"
        (click)="onSaveClick()"
      >
        Check changes
      </button>
      <!-- Redirect to metadata extraction instead of next step if changes made -->
      <!-- TODO Modal popup when hasUnsavedChanges -->
      <button
        class="btn"
        [class.btn-primary]="!harvest.isMappingsDirty"
        [class.btn-danger]="harvest.isMappingsDirty"
        [disabled]="loading"
        (click)="onNextClick()"
      >
        {{
          harvest.isMappingsDirty
            ? "Continue without checking changes"
            : "Continue"
        }}
      </button>
    </div>
  `,
})
export class HarvestMetadataReviewComponent
  extends withUnsubscribe()
  implements OnInit, UnsavedInputCheckingComponent
{
  @Input() public project: Project;
  @Input() public harvest: Harvest;

  @Output() public stage = new EventEmitter<HarvestStage>();

  public loading: boolean;
  public hasUnsavedChanges: boolean;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public siteColumnLabel: string;

  public constructor(
    private config: ConfigService,
    private notification: ToastrService,
    private harvestApi: ShallowHarvestsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
  }

  public setMapping(index: number, mapping: HarvestMapping) {
    this.harvest.mappings[index] = mapping;
  }

  public trackByPath(_: number, mapping: HarvestMapping) {
    return mapping.path;
  }

  public onNextClick(): void {
    this.transition("processing");
  }

  public onBackClick(): void {
    this.transition("uploading");
  }

  public onSaveClick(): void {
    this.transition("scanning");
  }

  private transition(stage: HarvestStatus): void {
    this.loading = true;

    // We want this api request to complete regardless of component destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.transitionStatus(this.harvest, stage).subscribe({
      next: (harvest) => {
        this.loading = false;
        this.stage.emit(HarvestStage[harvest.status]);
      },
      error: (err: BawApiError) => {
        this.loading = false;
        this.notification.error(err.message);
      },
    });
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
      .updateMappings(this.harvest, this.harvest.mappings)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        error: (err: BawApiError) =>
          this.notification.error("Failed to make that change: " + err.message),
      });
  }
}
