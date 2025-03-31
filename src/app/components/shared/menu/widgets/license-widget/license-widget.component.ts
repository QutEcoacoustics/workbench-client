import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { retrieveResolvedStructure } from "@baw-api/resolver-common";
import { WidgetComponent } from "@menu/widget.component";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { firstValueFrom, map } from "rxjs";

@Component({
  selector: "baw-license-widget",
  template: `
    @if (licenses()) {
    <section id="license-widget" class="pb-3">
      <p id="label" class="m-0 fs-5">License</p>
      <small class="m-0">
        @for (license of licenses(); track license) {
        {{ license }}
        }
      </small>
    </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseWidgetComponent implements OnInit, WidgetComponent {
  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public licenses = signal<string[]>(["Unknown"]);

  public ngOnInit(): void {
    const routeInformation = this.sharedRoute.pageInfo.pipe(
      map((page) => {
        const project = retrieveResolvedStructure(page, "license");
        if (!project) {
          return;
        }

        const license = project.license;
        if (license) {
          this.licenses.set([license]);
        }
      })
    );

    firstValueFrom(routeInformation);
  }
}
