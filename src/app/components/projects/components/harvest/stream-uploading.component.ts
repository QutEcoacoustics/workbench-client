import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  HarvestPolling,
  HarvestStage,
} from "@components/projects/pages/harvest/harvest.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Harvest, HarvestMapping, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "baw-harvest-stream-uploading",
  template: `
    <h3>Uploading Files</h3>

    <p>You can upload to:</p>

    <p>
      <a [href]="harvest.uploadUrl">{{ harvest.uploadUrl }}</a>
    </p>

    <p>Rules:</p>

    <ol>
      <li>Files must be placed in the provided folders (shown below)</li>
      <li>Files must use an unambiguous format INSERT LINK</li>
      <li>
        Successfully uploaded files will no longer be visible in the SFTP
        connection - you can access them from the
        <a [strongRoute]="audioRecordings.route">{{ audioRecordings.label }}</a>
        page
      </li>
      <li>Duplicate or corrupt files will be rejected automatically</li>
    </ol>

    <p>Here are some example URLs you can use to upload your files:</p>

    <ngx-datatable
      class="mb-3"
      bawDatatableDefaults
      [rows]="mappings"
      [externalPaging]="false"
      [externalSorting]="false"
    >
      <ngx-datatable-column prop="siteId">
        <ng-template let-column="column" ngx-datatable-header-template>
          Site/Point
        </ng-template>
        <ng-template let-row="row" ngx-datatable-cell-template>
          <baw-loading
            *ngIf="row.site | isUnresolved; else showSite"
            size="sm"
          ></baw-loading>

          <ng-template #showSite>
            <a [bawUrl]="row.site.getViewUrl(project)">
              {{ row.site.name }}
            </a>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column prop="path">
        <ng-template let-column="column" ngx-datatable-header-template>
          Upload folder
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value }}
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column prop="url">
        <ng-template let-column="column" ngx-datatable-header-template>
          Example URL
        </ng-template>
        <ng-template let-row="row" ngx-datatable-cell-template>
          <a [href]="getMappingUploadUrl(row)">
            {{ getMappingUploadUrl(row) }}
          </a>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>

    <!-- TODO Extract to sub component -->
    <h4>Current Progress</h4>

    <ul>
      <li><b>Uploaded Files: </b>{{ harvest.report.itemsTotal }}</li>
      <li>
        <b>Uploaded Bytes: </b>{{ harvest.report.itemsSizeBytes }} ({{
          harvest.report.itemsSize
        }})
      </li>
    </ul>

    <div class="clearfix">
      <p>
        If you close this harvest you cannot reopen it and the passwords will be
        revoked permanently
      </p>
      <button
        class="btn btn-danger float-end"
        [disabled]="loading"
        (click)="closeConnectionClick()"
      >
        Close Connection
      </button>
    </div>
  `,
})
export class HarvestStreamUploadingComponent implements OnInit {
  @Input() public project: Project;
  @Input() public harvest: Harvest;
  @Input() public startPolling: HarvestPolling;
  @Output() public stage = new EventEmitter<HarvestStage>();

  public loading: boolean;
  public active = 1;
  public audioRecordings = audioRecordingMenuItems.list.project;
  public mappings: HarvestMapping[];

  public constructor(
    private notifications: ToastrService,
    private harvestApi: ShallowHarvestsService
  ) {}

  public ngOnInit(): void {
    this.mappings = this.harvest.mappings;
    this.startPolling(5000);
  }

  public getMappingUploadUrl(mapping: IHarvestMapping) {
    return this.harvest.uploadUrl + "/" + mapping.path;
  }

  public closeConnectionClick(): void {
    this.loading = true;

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.transitionStatus(this.harvest, "complete").subscribe({
      next: (harvest): void => {
        this.loading = false;
        this.stage.emit(HarvestStage[harvest.status]);
      },
      error: (err: BawApiError): void => {
        this.loading = false;
        this.notifications.error(err.message);
      },
    });
  }
}
