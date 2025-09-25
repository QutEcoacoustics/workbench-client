import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from "@angular/core";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { filterModelIds } from "@helpers/filters/filters";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers, MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

// TODO Implement system to change colour of selected sites
@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="markers()"></baw-map>',
  imports: [MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteMapComponent extends withUnsubscribe() implements OnChanges {
  public readonly selected = input<List<Site>>();
  public readonly projects = input<Project[]>([]);
  public readonly regions = input<Region[]>([]);
  public readonly sites = input<Site[]>([]);

  private readonly sitesApi = inject(ShallowSitesService);

  protected markers = signal(List<MapMarkerOptions>());

  // using ngOnChanges instead of ngOnInit for reactivity
  // this allows us to dynamically update the projects, regions, sites, etc... without destroying the entire component
  public ngOnChanges(): void {
    const pagingFilters: Filters<Site> = { paging: { disablePaging: true } };
    const innerFilters = this.getFilter();
    const filters: Filters<Site> = {
      ...pagingFilters,
      ...{ filter: innerFilters },
    };

    // we use a falsy assertion for sitesSubset here because if sitesSubset is undefined or the length is zero
    // we want to fetch all markers for the project/region
    if (this.sites()?.length) {
      // TODO: The typing for siteSubsets shouldn't allow "undefined" values.
      // This is a sign that our typing is broken somewhere.
      this.pushMarkers(this.sites() ?? []);
    } else {
      this.sitesApi
        .filter(filters)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (sites: Site[]) => this.pushMarkers(sites),
          error: (err) => {
            this.markers.set(List());
            throw new Error("Failed to load sites for map", { cause: err });
          },
        });
    }
  }

  private getFilter(): InnerFilter<Site> {
    let modelFilters: InnerFilter<Site> = {};

    if (this.sites()?.length) {
      const siteIds = this.sites().map((site) => site.id);
      modelFilters = filterModelIds<Site>("id", siteIds);
    } else if (this.regions()?.length) {
      const regionIds = this.regions().map((region) => region.id);
      modelFilters = filterModelIds<Site>("regions", regionIds);
    } else if (this.projects()?.length) {
      const projectIds = this.projects().map((project) => project.id);
      modelFilters = filterModelIds<Site>("projects", projectIds);
    }

    return modelFilters;
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    const newMarkers = sanitizeMapMarkers(sites.map((site) => site.getMapMarker()));
    this.markers.update((current) => current.concat(newMarkers));
  }
}
