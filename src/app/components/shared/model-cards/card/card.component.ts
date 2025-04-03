import { Component, Input, OnInit } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { LicensesService } from "@services/licenses/licenses.service";
import { map, Observable } from "rxjs";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card",
  styleUrl: "./card.component.scss",
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
        <a class="card-title truncate" [bawUrl]="model.viewUrl">
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
          @if (isOwner) {
          <div id="owner" class="badge text-bg-highlight">Owner</div>
          }

          @if (licenseText != null) {
          <div
            class="license-badge badge text-bg-secondary"
            ngbTooltip="This license has been applied to all data, metadata, and analysis results"
            container="body"
          >
            {{ licenseText }}
          </div>
          }

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
  `,
})
export class CardComponent implements OnInit {
  public constructor(
    private recordingApi: AudioRecordingsService,
    private session: BawSessionService,
    private licenseService: LicensesService,
  ) {}

  @Input() public model: Project | Region;

  public hasNoAudio$: Observable<boolean>;
  protected isOwner: boolean;
  protected licenseText: string | undefined = undefined;

  public ngOnInit(): void {
    this.isOwner = this.model.creatorId === this.session.loggedInUser?.id;
    this.hasNoAudio$ = this.getRecordings().pipe(
      map((recordings): boolean => recordings.length === 0)
    );
    this.updateLicense();
  }

  private getRecordings(): Observable<AudioRecording[]> {
    const filters: Filters<AudioRecording> = { paging: { items: 1 } };
    if (this.model instanceof Region) {
      return this.recordingApi.filterByRegion(filters, this.model);
    } else {
      return this.recordingApi.filterByProject(filters, this.model);
    }
  }

  private async updateLicense() {
    if (this.model.license === null) {
      this.licenseText = null;
      return;
    }

    const isSpdxLicense = await this.licenseService.isSpdxLicense(this.model.license);
    if (isSpdxLicense) {
      this.licenseText = this.model.license;
    } else {
      this.licenseText = "Custom License";
    }
  }
}
