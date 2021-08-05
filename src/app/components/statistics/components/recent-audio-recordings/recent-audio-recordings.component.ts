import { Component, Inject, Input, OnChanges } from "@angular/core";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

@Component({
  selector: "baw-recent-audio-recordings",
  template: `
    <h2>Recent Audio Recordings</h2>

    <ngx-datatable
      #table
      bawDatatableDefaults
      [columnMode]="columnMode.force"
      [rows]="rows"
      [columns]="columns"
    >
      <!-- Site name -->
      <ngx-datatable-column name="Site" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'map-marker-alt']"></fa-icon>Site
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <span>{{ value.site?.name }}</span>
          <baw-loading *ngIf="value.site | isUnresolved"></baw-loading>
        </ng-template>
      </ngx-datatable-column>

      <!-- Duration -->
      <ngx-datatable-column name="Duration" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'clock']"></fa-icon>Duration
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value | toRelative }}
        </ng-template>
      </ngx-datatable-column>

      <!-- Uploaded -->
      <ngx-datatable-column name="Uploaded" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'calendar-alt']"></fa-icon>Uploaded
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value | toRelative }}
        </ng-template>
      </ngx-datatable-column>

      <!-- Actions -->
      <ngx-datatable-column name="Model" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          <a class="btn btn-sm btn-primary" [bawUrl]="value.viewUrl"> Play </a>
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

  public constructor(@Inject(IS_SERVER_PLATFORM) public isLoggedIn: boolean) {}

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [{ name: "Duration" }, { name: "Uploaded" }];

      if (this.isLoggedIn) {
        this.columns = [{ name: "Site" }, ...this.columns, { name: "Model" }];
      }
    }

    this.rows = (this.audioRecordings ?? []).map((recording) => ({
      site: recording,
      duration: recording.duration,
      uploaded: recording.recordedDate,
      model: recording,
    }));
  }
}
