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
import { ProjectsService } from "@baw-api/project/projects.service";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { WithLoadingPipe } from "@pipes/with-loading/with-loading.pipe";
import { LicensesService } from "@services/licenses/licenses.service";
import { LoadingComponent } from "@shared/loading/loading.component";
import { firstValueFrom, map, Observable } from "rxjs";

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
  private readonly projectService = inject(ProjectsService);

  public readonly model = input<Project | Region>();

  protected readonly licenseResource = resource({
    params: () => ({ cardModel: this.model() }),
    loader: ({ params }): Promise<string | null> => {
      const cardModel = params.cardModel;
      if (cardModel instanceof Project) {
        return Promise.resolve(cardModel.license);
      }

      // Because regions can only have a maximum of one project, it is safe to
      // take the first result.
      // However, because regions can become orphaned, I need a nullish check
      // before accessing the license property so that if no project is found,
      // we do not throw an error.
      //
      // I also use nullish coalescing to return null if no license is found
      // so that we don't mix undefined and null return types when there are no
      // projects associated with the region.
      const projectLicense = this.projectService.getProjectFor(cardModel).pipe(
        map((project) => project[0]?.license ?? null),
      );

      return firstValueFrom(projectLicense);
    },
  });

  protected readonly licenseTextResource = resource({
    params: () => ({ license: this.licenseResource.value() }),
    loader: async ({ params }) => {
      return await this.licenseService.licenseText(params.license);
    },
  });

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
