import { Component, Inject, Input, OnChanges } from "@angular/core";
import { AudioEvent } from "@models/AudioEvent";
import { Tag } from "@models/Tag";
import { ColumnMode, TableColumn } from "@swimlane/ngx-datatable";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";

@Component({
  selector: "baw-recent-annotations",
  template: `
    <h2>Recent Annotations</h2>

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

      <!-- User name -->
      <ngx-datatable-column name="Site" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'user']"></fa-icon>User
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <a [bawUrl]="value.creator?.viewUrl">
            {{ value.creator?.userName }}
          </a>
          <baw-loading *ngIf="value.creator | isUnresolved"></baw-loading>
        </ng-template>
      </ngx-datatable-column>

      <!-- Tags -->
      <ngx-datatable-column name="Tags" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'tags']"></fa-icon>Tags
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <span>{{ value.tags?.map(extractTagNames)?.join(",") }}</span>
          <baw-loading *ngIf="value.tags | isUnresolved"></baw-loading>
        </ng-template>
      </ngx-datatable-column>

      <!-- Updated -->
      <ngx-datatable-column name="Updated" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon [icon]="['fas', 'calendar-alt']"></fa-icon>Updated
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
          <a class="btn btn-sm btn-primary" [bawUrl]="value.listenViewUrl">
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

  public extractTagNames = (tag: Tag) => tag.text;

  public constructor(@Inject(IS_SERVER_PLATFORM) public isLoggedIn: boolean) {}

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [{ name: "Tags" }, { name: "Updated" }];

      if (this.isLoggedIn) {
        this.columns = [
          { name: "Site" },
          { name: "User" },
          ...this.columns,
          { name: "Model" },
        ];
      }
    }

    this.rows = (this.annotations ?? []).map((recording) => ({
      site: recording,
      user: recording,
      tags: recording,
      updated: recording.updatedAt,
      model: recording,
    }));
  }
}
