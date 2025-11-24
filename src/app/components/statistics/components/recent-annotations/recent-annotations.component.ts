import { Component, computed, inject, input } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioEvent } from "@models/AudioEvent";
import {
  ColumnMode,
  TableColumn,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { TimeSinceComponent } from "@shared/datetime-formats/time-since/time-since.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
  selector: "baw-recent-annotations",
  templateUrl: "./recent-annotations.component.html",
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
export class RecentAnnotationsComponent {
  protected readonly session = inject(BawSessionService);

  public readonly annotations = input.required<AudioEvent[] | undefined>();

  protected readonly columnMode = ColumnMode;
  protected readonly columns: TableColumn[] =[
    { name: "Site" },
    { name: "User" },
    { name: "Tags" },
    { name: "Updated" },
    { name: "Model" },
  ];

  protected readonly rows = computed(() => {
    return (this.annotations() ?? []).map((recording) => ({
      site: recording,
      user: recording,
      tags: recording,
      updated: recording.updatedAt,
      model: recording,
    }))
  });
}
