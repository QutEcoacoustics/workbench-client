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
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
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

  protected readonly licenseTextResource = resource({
    params: () => ({ cardModel: this.model() }),
    loader: async ({ params }) => {
      const cardModel = params.cardModel;
      if (cardModel instanceof Project) {
        return Promise.resolve(cardModel.license);
      }

      const projectLicense = this.projectService.getProjectFor(cardModel).pipe(
        map((projects) => {
          return projects
            .map((project) => project.license)
            .find(isInstantiated);
        }),
        // I use nullish coalescing so that the projectLicense matches the type
        // signature on the project.license property (string | null).
        // If I did not use nullish coalescing, the type would be
        // string | undefined if there were no instantiated licenses.
        map((license) => license ?? null),
      ) satisfies Observable<Project["license"]>;

      const license = await firstValueFrom(projectLicense);

      return await this.licenseService.licenseText(license);
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
