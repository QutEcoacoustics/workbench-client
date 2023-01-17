import { Component, Input, OnInit } from "@angular/core";
import { MapMarker } from "@angular/google-maps";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Direction, Filters } from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  sanitizeMapMarkers,
} from "@shared/map/map.component";
import { List } from "immutable";
import { DateTime } from "luxon";
import { Observable } from "rxjs";
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
  public marker: List<MapMarker>;
  public recentAudioEvents: AudioEvent[];

  public constructor(private audioRecordingsApi: AudioRecordingsService) {
    super();
  }

  public ngOnInit(): void {
    this.marker = sanitizeMapMarkers(this.site.getMapMarker());

    this.getNewestDates();
    this.getOldestDates();
  }

  public humanizeDate(audioRecording: AudioRecording): string {
    if (audioRecording) {
      return audioRecording.recordedDate.toLocaleString(DateTime.DATETIME_FULL);
    } else if (audioRecording === null) {
      return "unknown";
    } else {
      return "(loading)";
    }
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
    filters: Filters<AudioRecording> = {}
  ): Observable<AudioRecording[]> {
    return this.audioRecordingsApi.filterBySite(
      { sorting: { orderBy: "recordedDate", direction }, ...filters },
      this.site
    );
  }
}

export { SiteComponent };
