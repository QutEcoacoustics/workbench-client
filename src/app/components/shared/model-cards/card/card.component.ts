import { Component, OnInit, input } from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { LicensesService } from "@services/licenses/licenses.service";
import { map, Observable } from "rxjs";
import { NgTemplateOutlet, AsyncPipe } from "@angular/common";
import { UrlDirective } from "@directives/url/url.directive";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { LoadingComponent } from "../../loading/loading.component";
import { WithLoadingPipe } from "../../../../pipes/with-loading/with-loading.pipe";

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
        <a [bawUrl]="model().viewUrl">
          <img [alt]="model().name + ' image'" [src]="model().imageUrls" />
        </a>
      </div>

      <div class="card-body">
        <!-- Title -->
        <a class="card-title truncate" [bawUrl]="model().viewUrl">
          <h4 [innerText]="model().name"></h4>
        </a>

        <!-- Description -->
        <div class="card-text">
          <div class="truncate">
            <p
              [innerHtml]="
                model().descriptionHtmlTagline ?? '<i>No description given</i>'
              "
            ></p>
          </div>
        </div>

        <div class="card-badges">
          @if (isOwner) {
            <div id="owner" class="badge text-bg-highlight">Owner</div>
          }

          @if (!!licenseText) {
            <div
              class="license-badge badge text-bg-secondary tooltip-hint"
              [ngbTooltip]="'This license has been applied to all data, metadata, and analysis results'"
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
      @if (hasNoAudio$ | withLoading | async; as hasNoAudio) {
        @if (hasNoAudio.value !== false) {
          <div id="no-audio" class="badge text-bg-secondary">
            @if (hasNoAudio.loading) {
              <baw-loading size="sm" color="light"></baw-loading>
            }
            @if (hasNoAudio.value) {
              <span>No audio yet</span>
            }
          </div>
        }
      }
    </ng-template>
  `,
  imports: [
    UrlDirective,
    AuthenticatedImageDirective,
    NgTemplateOutlet,
    NgbTooltip,
    LoadingComponent,
    AsyncPipe,
    WithLoadingPipe,
  ],
})
export class CardComponent implements OnInit {
  public constructor(
    private recordingApi: AudioRecordingsService,
    private session: BawSessionService,
    private licenseService: LicensesService,
  ) {}

  public readonly model = input<Project | Region>(undefined);

  public hasNoAudio$: Observable<boolean>;
  protected isOwner: boolean;
  protected licenseText: string | undefined = undefined;

  public ngOnInit(): void {
    this.isOwner = this.model().creatorId === this.session.loggedInUser?.id;
    this.hasNoAudio$ = this.getRecordings().pipe(
      map((recordings): boolean => recordings.length === 0),
    );
    this.updateLicense();
  }

  private getRecordings(): Observable<AudioRecording[]> {
    const filters: Filters<AudioRecording> = { paging: { items: 1 } };
    const model = this.model();
    if (model instanceof Region) {
      return this.recordingApi.filterByRegion(filters, model);
    } else {
      return this.recordingApi.filterByProject(filters, model);
    }
  }

  private async updateLicense() {
    const model = this.model();
    if (model.license === null) {
      this.licenseText = null;
      return;
    }

    this.licenseText = await this.licenseService.licenseText(
      model.license,
    );
  }
}
