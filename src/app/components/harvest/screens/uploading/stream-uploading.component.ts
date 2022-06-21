import { Component, OnInit } from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestMapping, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";

@Component({
  selector: "baw-harvest-stream-uploading",
  template: `
    <h3>Uploading Files</h3>

    <p>You can upload to:</p>

    <baw-harvest-upload-url [harvest]="harvest"></baw-harvest-upload-url>

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
          {{ getMappingUploadUrl(row) }}
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>

    <baw-harvest-progress [harvest]="harvest"></baw-harvest-progress>

    <div class="clearfix">
      <p>
        If you close this harvest you cannot reopen it and the passwords will be
        revoked permanently
      </p>
      <button
        class="btn btn-warning float-end"
        [disabled]="loading"
        (click)="closeConnectionClick()"
      >
        Close Connection
      </button>
    </div>
  `,
})
export class HarvestStreamUploadingComponent implements OnInit {
  public loading: boolean;
  public active = 1;
  public audioRecordings = audioRecordingMenuItems.list.project;
  public mappings: HarvestMapping[];

  public constructor(private stages: HarvestStagesService) {}

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get project(): Project {
    return this.stages.project;
  }

  public ngOnInit(): void {
    // TODO If mapping updates are possible after the initial load, we may want
    // to check for changes whenever harvest is updated
    this.mappings = this.stages.harvest.mappings;
    this.stages.startPolling(5000);
  }

  public getMappingUploadUrl(mapping: IHarvestMapping) {
    return this.stages.harvest.uploadUrl + "/" + mapping.path;
  }

  public closeConnectionClick(): void {
    this.loading = true;
    this.stages.transition("complete", () => (this.loading = false));
  }
}
