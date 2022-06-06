import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-harvest-metadata-review",
  template: `
    <h3>Review</h3>

    <p>This is a review of the audio data</p>

    <ngx-datatable
      class="mb-3"
      bawDatatableDefaults
      [rows]="mappings"
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
          <baw-site-selector
            [project]="project"
            [siteId]="value"
            (siteIdChange)="setSite(row, $event)"
          ></baw-site-selector>
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
            [project]="project"
            [offset]="value"
            (offsetChange)="setOffset(row, $event)"
          ></baw-utc-offset-selector>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>

    <div class="clearfix">
      <button
        class="btn btn-outline-primary float-start"
        (click)="onBackClick()"
      >
        Make changes or upload more files
      </button>
      <!-- Redirect to metadata extraction instead of next step if changes made -->
      <button class="btn btn-primary float-end" (click)="onSaveClick()">
        Save and upload
      </button>
    </div>
  `,
})
export class HarvestMetadataReviewComponent
  extends withUnsubscribe()
  implements OnInit, UnsavedInputCheckingComponent
{
  @Output() public stage = new EventEmitter<HarvestStage>();

  public hasUnsavedChange: boolean;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;
  public project: Project;
  public siteColumnLabel: string;
  public harvest: Harvest;
  public mappings: IHarvestMapping[] = [];

  public constructor(
    private config: ConfigService,
    private siteApi: SitesService,
    private route: ActivatedRoute,
    private injector: Injector
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = retrieveResolvedModel(this.route.snapshot.data, Project);
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
    this.harvest = new Harvest(
      {
        id: 1,
        streaming: false,
        status: "metadataExtraction",
        projectId: 16,
        uploadPassword: "w4XNP2eex0Inn6b",
        uploadUser: "Amir8",
        uploadUrl: "http://torn-rebel.name",
        mappings: [],
        report: {
          itemsTotal: 28007,
          itemsSizeBytes: 98463,
          itemsDurationSeconds: 21751,
          itemsInvalidFixable: 24169,
          itemsInvalidNotFixable: 66148,
          itemsNew: 70929,
          itemsMetadataGathered: 20843,
          itemsFailed: 49183,
          itemsCompleted: 87754,
          itemsErrored: 28281,
          latestActivity: "2022-01-18T05:14:37.892Z",
          runTimeSeconds: 30693,
        },
        creatorId: 12,
        createdAt: "2022-02-24T15:53:12.027Z",
        updaterId: 13,
        updatedAt: "2021-08-26T04:04:28.745Z",
      },
      this.injector
    );

    // TODO this is temporary until we have a real API
    this.siteApi
      .list(this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((sites) => {
        this.mappings = sites.map((site) => ({
          path: site.id + "/",
          siteId: site.id,
          utcOffset: undefined,
          recursive: false,
        }));

        this.mappings.push({
          path: "obviously_wrong_path/",
          recursive: true,
        });
      });
  }

  public setMapping(index: number, mapping: IHarvestMapping) {
    this.mappings[index] = mapping;
  }

  public onGoForwards(): void {
    // If changes made to harvest, show warning modal
  }

  public trackByPath(_: number, mapping: IHarvestMapping) {
    return mapping.path;
  }

  public onBackClick(): void {
    this.stage.emit(HarvestStage.uploading);
  }

  public onSaveClick(): void {
    this.stage.emit(HarvestStage.processing);
  }

  public setSite(mapping: IHarvestMapping, siteId: number) {
    mapping.siteId = siteId;
  }

  public setOffset(mapping: IHarvestMapping, offset: string) {
    mapping.utcOffset = offset;
  }
}
