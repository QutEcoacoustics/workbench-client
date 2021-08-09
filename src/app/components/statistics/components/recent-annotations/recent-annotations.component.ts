import { Component, Input, OnChanges } from "@angular/core";
import { SecurityService } from "@baw-api/security/security.service";
import { AudioEvent } from "@models/AudioEvent";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";

@Component({
  selector: "baw-recent-annotations",
  template: `
    <h2>Recent Annotations</h2>

    <ngx-datatable
      bawDatatableDefaults
      [externalPaging]="false"
      [externalSorting]="false"
      [footerHeight]="0"
      [columnMode]="columnMode.force"
      [rows]="rows"
      [columns]="columns"
    >
      <!-- Site name (logged in only) -->
      <ngx-datatable-column name="Site" *ngIf="isLoggedIn" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'map-marker-alt']"></fa-icon>
          Site
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-loading
            *ngIf="
              (value.audioRecording | isUnresolved) ||
                (value.audioRecording?.site | isUnresolved);
              else showSite
            "
            size="sm"
          ></baw-loading>
          <ng-template #showSite>
            <span>
              {{ value.audioRecording?.site?.name ?? "Unknown Site" }}
            </span>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>

      <!-- User name (logged in only) -->
      <ngx-datatable-column name="Site" *ngIf="isLoggedIn" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'user']"></fa-icon>User
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-loading
            *ngIf="value.creator | isUnresolved; else showUser"
            size="sm"
          ></baw-loading>

          <ng-template #showUser>
            <a [bawUrl]="value.creator.viewUrl">
              {{ value.creator.userName }}
            </a>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>

      <!-- Tags -->
      <ngx-datatable-column name="Tags" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'tags']"></fa-icon>Tags
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <span *ngFor="let tag of value.tags" class="badge bg-highlight me-1">
            {{ tag.text ?? "(unknown)" }}
          </span>

          <baw-loading
            *ngIf="value.tags | isUnresolved; else noTags"
            size="sm"
          ></baw-loading>

          <ng-template #noTags>
            <span *ngIf="value.tags.length === 0" class="badge bg-highlight">
              (none)
            </span>
          </ng-template>
        </ng-template>
      </ngx-datatable-column>

      <!-- Updated -->
      <ngx-datatable-column name="Updated" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'calendar-alt']"></fa-icon>
          Updated
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          {{ value | toRelative }}
        </ng-template>
      </ngx-datatable-column>

      <!-- Actions (logged in only) -->
      <ngx-datatable-column
        name="Model"
        *ngIf="isLoggedIn"
        [width]="175"
        [maxWidth]="175"
        [sortable]="false"
      >
        <ng-template let-column="column" ngx-datatable-header-template>
        </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          <a class="btn btn-sm btn-primary me-2" [bawUrl]="value.listenViewUrl">
            Play
          </a>
          <a
            class="btn btn-sm btn-secondary"
            [bawUrl]="value.annotationViewUrl"
          >
            Annotation
          </a>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
})
export class RecentAnnotationsComponent implements OnChanges {
  @Input() public annotations!: AudioEvent[] | undefined;

  public columnMode = ColumnMode;
  public columns: TableColumn[];
  public rows = [];
  public isLoggedIn: boolean;

  public constructor(private api: SecurityService) {}

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [
        { name: "Site" },
        { name: "User" },
        { name: "Tags" },
        { name: "Updated" },
        { name: "Model" },
      ];
      this.isLoggedIn = true;
      //this.isLoggedIn = this.api.isLoggedIn();
    }

    this.rows = (this.annotations ?? []).map((recording) => ({
      site: recording,
      user: recording,
      tags: recording,
      updated: recording.updatedAt,
      model: recording,
    }));

    console.log(this.rows);
  }
}
