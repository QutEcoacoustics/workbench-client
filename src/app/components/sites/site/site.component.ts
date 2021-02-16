import { Component, Input, OnInit } from "@angular/core";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Direction, Filters } from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
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
  public oldestRecording: AudioRecording;
  public newestRecording: AudioRecording;
  public marker: List<MapMarkerOption>;
  public recentAudioEvents: AudioEvent[];

  public constructor(
    private audioEventsApi: ShallowAudioEventsService,
    private audioRecordingsApi: AudioRecordingsService
  ) {
    super();
  }

  public ngOnInit() {
    this.marker = sanitizeMapMarkers(this.site.getMapMarker());

    this.getAnnotations();
    this.getNewestDates();
    this.getOldestDates();
  }

  public humanizeDate(audioRecording: AudioRecording) {
    if (audioRecording) {
      return audioRecording.recordedDate.toLocaleString(DateTime.DATETIME_FULL);
    } else if (audioRecording === null) {
      return "unknown";
    } else {
      return "(loading)";
    }
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
          let numTags = 0;
          this.recentAudioEvents = [];

          for (const event of events) {
            this.recentAudioEvents.push(event);
            // An event with no taggings will still show a (not tagged) tag
            numTags += Math.max(event.taggings.length, 1);

            if (numTags > maxTags) {
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
          this.newestRecording = recordings[0];
          this.recordings = recordings;
        },
        () => {
          this.newestRecording = null;
          this.recordings = null;
        }
      );
  }

  private getOldestDates() {
    this.filterByDates("asc", { paging: { items: 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (recordings) =>
          (this.oldestRecording = recordings.length > 0 ? recordings[0] : null),
        () => (this.oldestRecording = null)
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
