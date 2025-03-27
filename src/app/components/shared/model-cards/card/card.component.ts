import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { map, Observable } from "rxjs";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card",
  styleUrls: ["./card.component.scss"],
  template: `
    <div class="card h-100">
      <!-- Image -->
      <div class="card-image position-relative">
        <a [bawUrl]="model.viewUrl">
          <img [alt]="model.name + ' image'" [src]="model.imageUrls" />
        </a>
      </div>

      <div class="card-body">
        <!-- Title -->
        <a class="card-title" [bawUrl]="model.viewUrl">
          <h4 [innerText]="model.name"></h4>
        </a>

        <!-- Description -->
        <div class="card-text">
          <div class="truncate">
            <p
              [innerHtml]="
                model.descriptionHtmlTagline ?? '<i>No description given</i>'
              "
            ></p>
          </div>
        </div>

        <div class="card-badges">
          <div *ngIf="isOwner" id="owner" class="badge text-bg-highlight">
            Owner
          </div>
          <ng-container [ngTemplateOutlet]="projectLicenseTemplate"></ng-container>
          <ng-container [ngTemplateOutlet]="noAudioTemplate"></ng-container>
        </div>
      </div>
    </div>

    <ng-template #noAudioTemplate>
      <ng-container *ngIf="hasNoAudio$ | withLoading | async as hasNoAudio">
        <div
          *ngIf="hasNoAudio.value !== false"
          id="no-audio"
          class="badge text-bg-secondary"
        >
          <baw-loading
            *ngIf="hasNoAudio.loading"
            size="sm"
            color="light"
          ></baw-loading>
          <span *ngIf="hasNoAudio.value">No audio yet</span>
        </div>
      </ng-container>
    </ng-template>

    <ng-template #projectLicenseTemplate>
      <div *ngIf="isOwner" id="owner" class="badge text-bg-secondary">
        License: {{ model.license ?? "Unknown" }}
      </div>
    </ng-template>
  `,
})
export class CardComponent implements OnInit {
  @Input() public model: Project | Region;
  public hasNoAudio$: Observable<boolean>;
  public isOwner: boolean;

  public constructor(
    private recordingApi: AudioRecordingsService,
    private session: BawSessionService
  ) {}

  public ngOnInit(): void {
    this.isOwner = this.model.creatorId === this.session.loggedInUser?.id;
    this.hasNoAudio$ = this.getRecordings().pipe(
      map((recordings): boolean => recordings.length === 0)
    );
  }

  private getRecordings(): Observable<AudioRecording[]> {
    const filters: Filters<AudioRecording> = { paging: { items: 1 } };
    if (this.model instanceof Region) {
      return this.recordingApi.filterByRegion(filters, this.model);
    } else {
      return this.recordingApi.filterByProject(filters, this.model);
    }
  }
}
