import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { WidgetComponent } from "@menu/widget.component";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { LicensesService } from "@services/licenses/licenses.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { firstValueFrom, map } from "rxjs";

@Component({
  selector: "baw-license-widget",
  template: `
    @if (licenses()) {
      <section id="license-widget" class="pb-3">
        <p id="label" class="m-0 fs-5">License</p>
        <small id="content" class="m-0">
          @for (license of licenses(); let isLast = $last; track license) {
            @if (license) {
              {{ license }}
            } @else {
              <a
                class="license-link text-muted italics"
                href="https://choosealicense.com/no-permission/"
              >
                No License
              </a>
            }
            {{ isLast ? "" : "," }}
          }
        </small>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseWidgetComponent implements OnInit, WidgetComponent {
  private readonly sharedRoute = inject(SharedActivatedRouteService);
  private readonly projectsApi = inject(ProjectsService);
  private readonly licenseService = inject(LicensesService);

  protected readonly licenses = signal<(string | null)[]>([null]);

  public ngOnInit(): void {
    const routeInformation = this.sharedRoute.pageInfo.pipe(
      map((page) => {
        const models = retrieveResolvers(page);
        if (!hasResolvedSuccessfully(models)) {
          return;
        }

        // find the first model with a license key
        const modelValues = Object.values(models);
        const targetModel = this.pickModel(modelValues);

        if (targetModel instanceof Project) {
          // If the model is a project, we can just use the license directly
          this.setLicenses([targetModel.license]);
          return;
        }

        const associatedProjectsRequest = this.projectsApi
          .getProjectFor(targetModel)
          .pipe(
            map((projects: Project[]) => {
              if (projects.length === 0) {
                return;
              }

              const licenses = projects.map((project) => project.license);
              this.setLicenses(licenses);
            }),
          );

        return firstValueFrom(associatedProjectsRequest);
      }),
    );

    firstValueFrom(routeInformation);
  }

  private pickModel(
    models: any[],
  ): AudioRecording | Site | Region | Project | undefined {
    // The order of the constructors is important. The lower the index, the
    // more specific the model. Meaning that it is favored over the
    // constructors that come after it.
    // For example, if an audio recording is found, we want to use the
    // license for the projects associated with the audio recording, not the
    // license for the route project.
    const supportedTypes = [AudioRecording, Site, Region, Project] as const;

    const targetModel: any = models.find((model) =>
      supportedTypes.includes(model.constructor),
    );

    if (!targetModel) {
      console.warn("Could not find a supported model");
      return;
    }

    return targetModel;
  }

  private async setLicenses(licenseIdentifiers: (string | null)[]) {
    const refinedLicenses = await Promise.all(
      licenseIdentifiers.map(
        async (identifier) => await this.licenseService.licenseText(identifier),
      ),
    );

    this.licenses.set(refinedLicenses);
  }
}
