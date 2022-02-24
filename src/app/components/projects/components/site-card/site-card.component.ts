import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "baw-site-card",
  template: `
    <li class="list-group-item p-2">
      <div class="body">
        <div class="heading m-0 mb-1">
          <a id="nameLink" [bawUrl]="model.getViewUrl(project)">
            <img
              id="image"
              class="me-2"
              [src]="model.imageUrls"
              [alt]="model.name + ' alt'"
            />
            <h5 id="name">{{ model.name }}</h5>
          </a>
        </div>

        <ul class="nav mb-0">
          <li *ngIf="region" class="nav-item" id="points">
            <span class="badge rounded-pill bg-highlight my-1">
              {{ numPoints() }} Points
            </span>
          </li>

          <ng-container [ngTemplateOutlet]="noAudioTemplate"></ng-container>
        </ul>
      </div>
    </li>

    <ng-template #noAudioTemplate>
      <ng-container *ngIf="hasNoAudio$ | withLoading | async as hasNoAudio">
        <li>
          <span
            *ngIf="hasNoAudio.value !== false"
            class="badge rounded-pill bg-secondary my-1"
          >
            <baw-loading
              *ngIf="hasNoAudio.loading"
              size="sm"
              color="light"
            ></baw-loading>
            <span *ngIf="hasNoAudio.value">No audio yet</span>
          </span>
        </li>
      </ng-container>
    </ng-template>
  `,
  styleUrls: ["./site-card.component.scss"],
})
export class SiteCardComponent implements OnInit {
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  public model: Site | Region;
  public hasNoAudio$: Observable<boolean>;

  public constructor(private recordingApi: AudioRecordingsService) {}

  public ngOnInit(): void {
    this.model = this.region || this.site;
    this.hasNoAudio$ = this.getRecording().pipe(
      map((recordings): boolean => recordings.length === 0)
    );
  }

  public numPoints(): number {
    return this.region?.siteIds?.size || 0;
  }

  private getRecording(): Observable<AudioRecording[]> {
    const filter = { paging: { items: 1 } };
    if (this.region) {
      return this.recordingApi.filterByRegion(filter, this.region);
    } else {
      return this.recordingApi.filterBySite(filter, this.site);
    }
  }
}
