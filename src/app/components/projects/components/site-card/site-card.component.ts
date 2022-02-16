import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { ApiErrorDetails } from "@helpers/custom-errors/baw-api-error";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "baw-site-card",
  template: `
    <li class="list-group-item p-2">
      <div class="me-2">
        <a id="imageLink" [bawUrl]="model.getViewUrl(project)">
          <img id="image" [src]="model.imageUrls" [alt]="model.name + ' alt'" />
        </a>
      </div>
      <div class="body">
        <div class="heading">
          <a id="nameLink" [bawUrl]="model.getViewUrl(project)">
            <h5 id="name">{{ model.name }}</h5>
          </a>
        </div>

        <ul class="nav">
          <li *ngIf="region" class="nav-item" id="points">
            <span class="badge rounded-pill me-1">
              {{ numPoints() }} Points
            </span>
          </li>

          <!-- Model details link -->
          <li class="nav-item">
            <a
              id="details"
              class="nav-link rounded-link-default"
              [bawUrl]="model.getViewUrl(project)"
            >
              <fa-icon [icon]="['fas', 'info-circle']"></fa-icon>
              Details
            </a>
          </li>

          <!-- Play audio link (if recording exists) -->
          <li *ngIf="site" class="nav-item">
            <!-- Play link if recording exists -->
            <a
              *ngIf="recording"
              id="play"
              class="nav-link rounded-link-default"
              [bawUrl]="recording?.viewUrl"
            >
              <fa-icon [icon]="['fas', 'play-circle']"></fa-icon>
              Play
            </a>
            <!-- No audio -->
            <a
              *ngIf="recording === null"
              id="no-audio"
              class="nav-link disabled rounded-link-default"
            >
              <fa-icon [icon]="['fas', 'play-circle']"></fa-icon>
              No Audio
            </a>
            <!-- Loading while retrieving recording -->
            <baw-loading
              *ngIf="recording === undefined"
              size="sm"
            ></baw-loading>
          </li>

          <!-- Visualize link -->
          <li class="nav-item">
            <a
              id="visualize"
              class="nav-link rounded-link-default"
              [bawUrl]="model.visualizeUrl"
            >
              <fa-icon [icon]="['fas', 'eye']"></fa-icon>
              Visualise
            </a>
          </li>

          <!-- Audio Recordings link (if recordings exist) -->
          <li class="nav-item">
            <a
              id="audio-recordings"
              class="nav-link rounded-link-default"
              [bawUrl]="model.getAudioRecordingsUrl(project)"
            >
              <fa-icon [icon]="['fas', 'file-audio']"></fa-icon>
              Audio Recordings
            </a>
          </li>
        </ul>
      </div>
    </li>
  `,
  styleUrls: ["./site-card.component.scss"],
})
export class SiteCardComponent extends withUnsubscribe() implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  public model: Site | Region;
  public recording: AudioRecording;

  public constructor(private recordingApi: AudioRecordingsService) {
    super();
  }

  public ngOnInit() {
    this.model = this.region || this.site;

    if (this.site) {
      this.getRecording();
    }
  }

  public numPoints() {
    return this.region?.siteIds?.size || 0;
  }

  private getRecording() {
    this.recordingApi
      .filterBySite(
        {
          sorting: { orderBy: "recordedDate", direction: "asc" },
          paging: { items: 1 },
        },
        this.site
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (recordings) =>
          (this.recording = recordings.length > 0 ? recordings[0] : null),
        (err: ApiErrorDetails) => {
          console.error(err);
          this.recording = null;
        }
      );
  }
}
