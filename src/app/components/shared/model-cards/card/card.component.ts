import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
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
import { LoadingComponent } from "@shared/loading/loading.component";
import { WithLoadingPipe } from "@pipes/with-loading/with-loading.pipe";

/**
 * Card Image Component
 */
@Component({
  selector: "baw-card",
  styleUrl: "./card.component.scss",
  templateUrl: "./card.component.html",
  imports: [
    UrlDirective,
    AuthenticatedImageDirective,
    NgTemplateOutlet,
    NgbTooltip,
    LoadingComponent,
    AsyncPipe,
    WithLoadingPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  private readonly recordingApi = inject(AudioRecordingsService);
  private readonly session = inject(BawSessionService);
  private readonly licenseService = inject(LicensesService);

  public readonly model = input<Project | Region>();

  protected readonly licenseText = computed(() =>
    this.licenseService.modelLicenseIdentifier(this.model()),
  );

  protected readonly isOwner = computed(
    () => this.model().creatorId === this.session.loggedInUser?.id,
  );

  protected hasNoAudio$: Observable<boolean> = this.getRecordings().pipe(
    map((recordings) => recordings.length === 0),
  );

  private getRecordings(): Observable<AudioRecording[]> {
    const filters: Filters<AudioRecording> = { paging: { items: 1 } };

    // We dereference the signal once so that TypeScript can correctly narrow
    // the type within each branch of the conditional.
    const modelInstance = this.model();
    if (modelInstance instanceof Region) {
      return this.recordingApi.filterByRegion(filters, modelInstance);
    } else {
      return this.recordingApi.filterByProject(filters, modelInstance);
    }
  }
}
