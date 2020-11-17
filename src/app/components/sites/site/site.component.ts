import { Component, Input, OnInit } from "@angular/core";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
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
  public recordingsEnd: DateTime;
  public recordingsStart: DateTime;
  public marker: List<MapMarkerOption>;
  public annotations: AudioEvent[];

  constructor(
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

  public humanizeDate(date: DateTime) {
    return date ? date.toLocaleString(DateTime.DATETIME_FULL) : "(loading)";
  }

  private getAnnotations() {
    this.audioEventsApi
      .filter({
        filter: { ["audio_recordings.site_id"]: { eq: this.site.id } } as any,
        sorting: { orderBy: "updatedAt", direction: "desc" },
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (events) => {
          // Limit the selection of audio events by tagging count
          let count = 0;
          const maxTags = 10;
          this.annotations = [];
          for (const event of events) {
            this.annotations.push(event);
            count++;

            if (count > maxTags) {
              return;
            }
          }
        },
        (err) => console.log({ err })
      );
  }

  private getNewestDates() {
    this.audioRecordingsApi
      .filter({
        filter: { ["sites.id"]: { eq: this.site.id } } as any,
        sorting: { orderBy: "recordedDate", direction: "desc" },
      })
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
    this.audioRecordingsApi
      .filter({
        filter: { ["sites.id"]: { eq: this.site.id } } as any,
        sorting: { orderBy: "recordedDate", direction: "asc" },
        paging: { items: 1 },
      })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (recordings) => (this.recordingsStart = recordings[0]?.recordedDate),
        (err) => console.log({ err })
      );
  }
}

export { SiteComponent };
