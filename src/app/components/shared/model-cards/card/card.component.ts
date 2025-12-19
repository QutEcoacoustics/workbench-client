import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource
} from "@angular/core";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { WithLoadingPipe } from "@pipes/with-loading/with-loading.pipe";
import { LicensesService } from "@services/licenses/licenses.service";
import { LoadingComponent } from "@shared/loading/loading.component";
import { map, Observable } from "rxjs";

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

  protected readonly license = resource({
    params: () => ({ model: this.model() }),
    loader: async ({ params }) => {
      return await params.model.license;
    },
  });

  protected readonly licenseText = computed(() =>
    this.licenseService.licenseText(this.license.value()),
  );

  protected readonly isOwner = computed(
    () => this.model().creatorId === this.session.loggedInUser?.id,
  );

  protected readonly hasNoAudio$: Observable<boolean> =
    this.getRecordings().pipe(map((recordings) => recordings.length === 0));

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
