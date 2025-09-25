import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Direction, Filters } from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers , MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { LoadingComponent } from "@shared/loading/loading.component";
import { ZonedDateTimeComponent } from "@shared/datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { WIPComponent } from "@shared/wip/wip.component";
import { RecentAnnotationsComponent } from "../recent-annotations/recent-annotations.component";

/**
 * Site Details Component
 */
@Component({
  selector: "baw-site",
  templateUrl: "./site.component.html",
  styleUrl: "./site.component.scss",
  imports: [
    AuthenticatedImageDirective,
    LoadingComponent,
    ZonedDateTimeComponent,
    WIPComponent,
    RecentAnnotationsComponent,
    MapComponent,
  ],
})
class SiteComponent extends PageComponent implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;

  public defaultDescription = "<i>No description found</i>";
  public recordings: AudioRecording[];
  public oldestRecording: AudioRecording;
  public newestRecording: AudioRecording;
  public marker: List<MapMarkerOptions>;
  public recentAudioEvents: AudioEvent[];

  public constructor(private audioRecordingsApi: AudioRecordingsService) {
    super();
  }

  public ngOnInit(): void {
    const markers = sanitizeMapMarkers(this.site.getMapMarker());
    this.marker = List(markers);

    this.getNewestDates();
    this.getOldestDates();
  }

  private getNewestDates() {
    this.filterByDates("desc")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (recordings) => {
          this.newestRecording = recordings[0];
          this.recordings = recordings;
        },
        error: () => {
          this.newestRecording = null;
          this.recordings = null;
        },
      });
  }

  private getOldestDates(): void {
    this.filterByDates("asc", { paging: { items: 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (recordings) =>
          (this.oldestRecording = recordings.length > 0 ? recordings[0] : null),
        error: () => (this.oldestRecording = null),
      });
  }

  private filterByDates(
    direction: Direction,
    filters: Filters<AudioRecording> = {},
  ): Observable<AudioRecording[]> {
    return this.audioRecordingsApi.filterBySite(
      { sorting: { orderBy: "recordedDate", direction }, ...filters },
      this.site,
    );
  }
}

export { SiteComponent };
