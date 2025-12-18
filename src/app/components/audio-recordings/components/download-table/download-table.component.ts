import { Component, Input, inject } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { ColumnMode, NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BehaviorSubject } from "rxjs";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { DatatableSortKeyDirective } from "@directives/datatable/sort-key/sort-key.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UrlDirective } from "@directives/url/url.directive";
import { ZonedDateTimeComponent } from "@shared/datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { DurationComponent } from "@shared/datetime-formats/duration/duration.component";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
  selector: "baw-download-table",
  templateUrl: "./download-table.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    DatatableSortKeyDirective,
    LoadingComponent,
    UrlDirective,
    ZonedDateTimeComponent,
    DurationComponent,
    IsUnresolvedPipe,
  ],
})
export class DownloadTableComponent {
  private readonly recordingsApi = inject(AudioRecordingsService);

  @Input() public filters$: BehaviorSubject<Filters<AudioRecording>>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public ColumnMode = ColumnMode;

  public getModels = (filters: Filters<AudioRecording>) =>
    this.recordingsApi.filter(filters);

  public asRecording(model: any): AudioRecording {
    return model;
  }
}
