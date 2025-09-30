import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { InnerFilter } from "@baw-api/baw-api.service";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { Site } from "@models/Site";

@Component({
  selector: "baw-region-map",
  templateUrl: "./region-map.component.html",
  styleUrl: "./region-map.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteMapComponent],
})
export class RegionMapComponent {
  public readonly filter = input.required<string>();
  protected readonly siteFilters = computed<InnerFilter<Site>>(() => {
    const textFilter = this.filter();
    if (!textFilter) {
      return undefined;
    }

    return { "regions.name": { contains: textFilter } } as any;
  });
}
