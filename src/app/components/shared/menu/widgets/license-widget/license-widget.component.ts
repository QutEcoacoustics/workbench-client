import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { WidgetComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { firstValueFrom, map } from "rxjs";
import spdxLicenseList from "spdx-license-list";

@Component({
  selector: "baw-license-widget",
  template: `
    @if(license()) {
    <section class="pb-3">
      <p id="label" class="m-0 fs-5">License</p>
      <small class="m-0">
        <a [href]="license().url">{{ license().name }}</a>
      </small>
    </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseWidgetComponent implements OnInit, WidgetComponent {
  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public license = signal<(typeof spdxLicenseList)[0] | null>(undefined);

  public ngOnInit(): void {
    const routeInformation = this.sharedRoute.pageInfo.pipe(
      map((page) => {
        const project = retrieveResolvedModel(page, Project);
        if (!project) {
          return;
        }

        const license = project.license;

        // in the spxLicenseList object, find the sub object where the license
        // name is equal to the license name of the project
        const licenseInformation = Object.values(spdxLicenseList).filter(
          (x) => x.name === license
        )[0];

        if (!licenseInformation) {
          return;
        }

        this.license.set(licenseInformation);
      })
    );

    firstValueFrom(routeInformation);
  }
}
