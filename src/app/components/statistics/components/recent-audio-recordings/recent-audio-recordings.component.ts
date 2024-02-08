import { Component, Input, OnChanges } from "@angular/core";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";

@Component({
  selector: "baw-recent-audio-recordings",
  template: `
    <h2>Recent Audio Recordings</h2>

    <ngx-datatable
      bawDatatableDefaults
      [externalPaging]="false"
      [externalSorting]="false"
      [footerHeight]="0"
      [rows]="rows"
      [columns]="columns"
    >
      <!-- Site name -->
      <ngx-datatable-column name="Site" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'map-marker-alt']"></fa-icon>
          Site
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-loading
            *ngIf="value.site | isUnresolved; else showSite"
            size="sm"
          ></baw-loading>
          <ng-template #showSite>
            <span>{{ value.site?.name ?? "Unknown Site" }}</span>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>

      <!-- Duration -->
      <ngx-datatable-column name="Duration" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'clock']"></fa-icon>Duration
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-duration [value]="value" humanized />
        </ng-template>
      </ngx-datatable-column>

      <!-- Uploaded -->
      <ngx-datatable-column name="Uploaded" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'calendar-alt']"></fa-icon>
          Uploaded
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-time-since [value]="value" />
        </ng-template>
      </ngx-datatable-column>

      <!-- Actions -->
      <ngx-datatable-column
        name="Model"
        [width]="70"
        [maxWidth]="70"
        [sortable]="false"
      >
        <ng-template let-column="column" ngx-datatable-header-template>
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          <a
            id="playBtn"
            class="btn btn-sm btn-primary"
            [bawUrl]="value.viewUrl"
          >
            Play
          </a>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
})
export class RecentAudioRecordingsComponent implements OnChanges {
  @Input() public audioRecordings!: AudioRecording[] | undefined;

  public columnMode = ColumnMode;
  public columns: TableColumn[];
  public rows = [];

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [
        { name: "Site" },
        { name: "Duration" },
        { name: "Uploaded" },
        { name: "Model" },
      ];
    }

    this.rows = (this.audioRecordings ?? []).map((recording) => ({
      site: recording,
      duration: recording.duration,
      uploaded: recording.recordedDate,
      model: recording,
    }));
  }
}
