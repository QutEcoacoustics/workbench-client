import { Component, Input, OnChanges } from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
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
      [columnMode]="columnMode.force"
      [rows]="rows"
      [columns]="columns"
    >
      <!-- Site name (logged in only) -->
      <ngx-datatable-column *ngIf="isLoggedIn" name="Site" [sortable]="false">
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
          {{ value | toRelative }}
        </ng-template>
      </ngx-datatable-column>

      <!-- Uploaded -->
      <ngx-datatable-column name="Uploaded" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'calendar-alt']"></fa-icon
          >Uploaded
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value | toRelative }}
        </ng-template>
      </ngx-datatable-column>

      <!-- Actions (logged in only) -->
      <ngx-datatable-column
        *ngIf="isLoggedIn"
        name="Model"
        [width]="70"
        [maxWidth]="70"
        [sortable]="false"
      >
        <ng-template let-column="column" ngx-datatable-header-template>
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          <a class="btn btn-sm btn-primary" [bawUrl]="value.viewUrl">Play</a>
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
  public isLoggedIn: boolean;

  public constructor(private api: SecurityService) {}

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [
        { name: "Site" },
        { name: "Duration" },
        { name: "Uploaded" },
        { name: "Model" },
      ];
      this.isLoggedIn = true;
      //this.isLoggedIn = this.api.isLoggedIn();
    }

    this.rows = (this.audioRecordings ?? []).map((recording) => ({
      site: recording,
      duration: recording.duration,
      uploaded: recording.recordedDate,
      model: recording,
    }));
  }
}
