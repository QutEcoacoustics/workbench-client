import { Component, Input, OnInit } from "@angular/core";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Direction, Filters } from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tagging } from "@models/Tagging";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { List } from "immutable";
import { DateTime } from "luxon";
import { takeUntil } from "rxjs/operators";

/**
 * Site Details Component
 */
@Component({
  selector: "baw-site",
  templateUrl: "./site.component.html",
  styleUrls: ["./site.component.scss"],
})
class SiteComponent extends PageComponent implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  public defaultDescription = "<i>No description found</i>";
  public recordings: AudioRecording[];
  public recordingsEnd: DateTime;
  public recordingsStart: DateTime;
  public marker: List<MapMarkerOption>;
  public taggings: Tagging[];

  public constructor(
    private audioEventsApi: ShallowAudioEventsService,
    private audioRecordingsApi: AudioRecordingsService,
    private mapService: MapService
  ) {
    super();
  }

  public ngOnInit() {
    this.marker = this.mapService.sanitizeMarkers([this.site.getMapMarker()]);

    this.getAnnotations();
    this.getNewestDates();
    this.getOldestDates();
  }

  public humanizeDate(date: DateTime) {
    return date ? date.toLocaleString(DateTime.DATETIME_FULL) : "(loading)";
  }

  private getAnnotations() {
    this.audioEventsApi
      .filterBySite(
        { sorting: { orderBy: "updatedAt", direction: "desc" } },
        this.site
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (events) => {
          // Limit the selection of audio events by tagging count
          const maxTags = 10;
          this.taggings = [];

          for (const event of events) {
            this.taggings.push(...event.taggings);

            if (this.taggings.length > maxTags) {
              return;
            }
          }
        },
        (err) => console.log({ err })
      );
  }

  private getNewestDates() {
    this.filterByDates("desc")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (recordings) => {
          this.recordingsEnd = recordings[0]?.recordedDate;
          this.recordings = recordings;
        },
        (err) => console.log({ err })
      );
  }

  private getOldestDates() {
    this.filterByDates("asc", { paging: { items: 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (recordings) => (this.recordingsStart = recordings[0]?.recordedDate),
        (err) => console.log({ err })
      );
  }

  private filterByDates(
    direction: Direction,
    filters: Filters<IAudioRecording> = {}
  ) {
    return this.audioRecordingsApi.filterBySite(
      { sorting: { orderBy: "recordedDate", direction }, ...filters },
      this.site
    );
  }
}

export { SiteComponent };
