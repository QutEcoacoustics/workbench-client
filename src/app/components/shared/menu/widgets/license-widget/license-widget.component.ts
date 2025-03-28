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

@Component({
  selector: "baw-license-widget",
  template: `
    @if(license()) {
    <section class="pb-3">
      <p id="label" class="m-0 fs-5">License</p>
      <small class="m-0">
        {{ license()}}
      </small>
    </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseWidgetComponent implements OnInit, WidgetComponent {
  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public license = signal<string>("Unknown");

  public ngOnInit(): void {
    const routeInformation = this.sharedRoute.pageInfo.pipe(
      map((page) => {
        const project = retrieveResolvedModel(page, Project);
        if (!project) {
          return;
        }

        const license = project.license;
        if (license) {
          this.license.set(license);
        }
      })
    );

    firstValueFrom(routeInformation);
  }
}
