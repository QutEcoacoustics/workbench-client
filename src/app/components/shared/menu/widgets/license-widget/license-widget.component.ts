import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
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
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { firstValueFrom, map } from "rxjs";

@Component({
  selector: "baw-license-widget",
  template: `
    @if (licenses()) {
    <section id="license-widget" class="pb-3">
      <p id="label" class="m-0 fs-5">License</p>
      <small class="m-0">
        @for (license of licenses(); let isLast = $last; track license) {
        {{ license }}{{ isLast ? "" : "," }}
        }
      </small>
    </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseWidgetComponent implements OnInit, WidgetComponent {
  public constructor(
    private sharedRoute: SharedActivatedRouteService,
    private projectsApi: ProjectsService
  ) {}

  public licenses = signal<string[]>(["Unknown"]);

  public ngOnInit(): void {
    const routeInformation = this.sharedRoute.pageInfo.pipe(
      map((page) => {
        const models = retrieveResolvers(page);
        if (!hasResolvedSuccessfully(models)) {
          return;
        }

        // find the first model with a license key
        const modelValues = Object.values(models);
        const availableModels = modelValues.filter(
          (model: any) => !!model?.license
        );

        const licenseModel = availableModels.at(-1);
        if (!licenseModel) {
          return;
        }

        let siteIds: number[] | undefined;

        if (licenseModel instanceof Project) {
          this.licenses.set([licenseModel.license]);
          return;
        } else if (licenseModel instanceof AudioRecording) {
          siteIds = [licenseModel.siteId];
        } else if (licenseModel instanceof Region) {
          siteIds = Array.from(licenseModel.siteIds);
        } else if (licenseModel instanceof Site) {
          siteIds = [licenseModel.id];
        }

        if (!siteIds) {
          return;
        }

        const associatedProjectsRequest = this.projectsApi
          .filter({
            // we have to type cast here because the inner filter is not
            // typed to allow association type checking
            //
            // TODO: remove this type cast once the types are updated
            // see: https://github.com/QutEcoacoustics/workbench-client/issues/1777
            filter: {
              "sites.id": {
                in: siteIds,
              },
            } as any,
          })
          .pipe(
            map((projects: Project[]) => {
              if (projects.length === 0) {
                return;
              }

              const licenses: string[] = projects.map((project) =>
                project.license ? project.license : "Unknown"
              );
              this.licenses.set(licenses);
            })
          );

        return firstValueFrom(associatedProjectsRequest);
      })
    );

    firstValueFrom(routeInformation);
  }
}
