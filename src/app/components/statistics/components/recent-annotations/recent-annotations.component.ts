import { Component, Input, OnChanges } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioEvent } from "@models/AudioEvent";
import { ColumnMode, TableColumn, NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { LoadingComponent } from "../../../shared/loading/loading.component";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { TimeSinceComponent } from "../../../shared/datetime-formats/time-since/time-since.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
  selector: "baw-recent-annotations",
  template: `
    <h2>Recent Annotations</h2>

    <ngx-datatable
      bawDatatableDefaults
      [externalPaging]="false"
      [externalSorting]="false"
      [footerHeight]="0"
      [rows]="rows"
      [columns]="columns"
    >
      <!-- Site name (logged in only) -->
      @if (session.isLoggedIn) {
        <ngx-datatable-column name="Site" [sortable]="false">
          <ng-template let-column="column" ngx-datatable-header-template>
            <fa-icon class="me-2" [icon]="['fas', 'map-marker-alt']"></fa-icon>
            Site
          </ng-template>

          <ng-template let-value="value" ngx-datatable-cell-template>
            @if ((value.audioRecording | isUnresolved) || (value.audioRecording?.site | isUnresolved)) {
              <baw-loading size="sm"></baw-loading>
            } @else {
              <span>
                {{ value.audioRecording?.site?.name ?? "Unknown Site" }}
              </span>
            }
          </ng-template>
        </ngx-datatable-column>
      }

      <!-- User name (logged in only) -->
      @if (session.isLoggedIn) {
        <ngx-datatable-column name="User" [sortable]="false">
          <ng-template let-column="column" ngx-datatable-header-template>
            <fa-icon class="me-2" [icon]="['fas', 'user']"></fa-icon>User
          </ng-template>

          <ng-template let-value="value" ngx-datatable-cell-template>
            @if (value.creator | isUnresolved) {
              <baw-loading size="sm"></baw-loading>
            } @else {
              <a [bawUrl]="value.creator.viewUrl">
                {{ value.creator.userName }}
              </a>
            }
          </ng-template>
        </ngx-datatable-column>
      }

      <!-- Tags -->
      <ngx-datatable-column name="Tags" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'tags']"></fa-icon>Tags
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          @for (tag of value.tags; track tag) {
            <span class="badge text-bg-highlight me-1">
              {{ tag.text }}
            </span>
          }

          @if (value.tags | isUnresolved) {
            <baw-loading size="sm"></baw-loading>
          } @else {
            @if (value.tags.length === 0) {
              (none)
            }
          }
        </ng-template>
      </ngx-datatable-column>

      <!-- Updated -->
      <ngx-datatable-column name="Updated" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template>
          <fa-icon class="me-2" [icon]="['fas', 'calendar-alt']"></fa-icon>
          Updated
        </ng-template>

        <ng-template let-value="value" ngx-datatable-cell-template>
          <baw-time-since [value]="value" />
        </ng-template>
      </ngx-datatable-column>

      <!-- Actions -->
      <ngx-datatable-column name="Model" [width]="175" [maxWidth]="175" [sortable]="false">
        <ng-template let-column="column" ngx-datatable-header-template> </ng-template>
        <ng-template let-value="value" ngx-datatable-cell-template>
          <a id="playBtn" class="btn btn-sm btn-primary me-2" [bawUrl]="value.listenViewUrl"> Play </a>
          <a id="annotationBtn" class="btn btn-sm btn-secondary" [bawUrl]="value.annotationViewUrl"> Annotation </a>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    FaIconComponent,
    LoadingComponent,
    UrlDirective,
    TimeSinceComponent,
    IsUnresolvedPipe,
  ],
})
export class RecentAnnotationsComponent implements OnChanges {
  @Input() public annotations!: AudioEvent[] | undefined;

  public columnMode = ColumnMode;
  public columns: TableColumn[];
  public rows = [];

  public constructor(public session: BawSessionService) {}

  public ngOnChanges(): void {
    if (!this.columns) {
      this.columns = [{ name: "Site" }, { name: "User" }, { name: "Tags" }, { name: "Updated" }, { name: "Model" }];
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
