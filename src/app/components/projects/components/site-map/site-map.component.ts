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
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers, MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

// TODO Implement system to change colour of selected sites
@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="toList()"></baw-map>',
  imports: [MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteMapComponent extends withUnsubscribe() implements OnChanges {
  public readonly selected = input<List<Site>>();
  public readonly regions = input<Region[]>([]);
  public readonly projects = input<Project[]>([]);

  /** Display a subset of sites from the project/region */
  public readonly sitesSubset = input<Site[]>([]);

  private readonly sitesApi = inject(ShallowSitesService);

  protected markers = signal<MapMarkerOptions[]>([]);

  // using ngOnChanges instead of ngOnInit for reactivity
  // this allows us to dynamically update the projects, regions, sites, etc... without destroying the entire component
  public ngOnChanges(): void {
    const pagingFilters: Filters<ISite> = { paging: { disablePaging: true } };
    const filters = this.getFilter(pagingFilters);

    this.markers.set([]);

    // we use a falsy assertion for sitesSubset here because if sitesSubset is undefined or the length is zero
    // we want to fetch all markers for the project/region
    if (
      (this.projects()?.length || this.regions()?.length) &&
      !this.sitesSubset()?.length
    ) {
      this.sitesApi
        .filter(filters)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (sites: Site[]) => this.pushMarkers(sites),
          error: (err) => {
            this.pushMarkers([])
            throw new Error("Failed to load sites for map", { cause: err });
          },
        });
    } else {
      // TODO: The typing for siteSubsets shouldn't allow "undefined" values.
      // This is a sign that our typing is broken somewhere.
      this.pushMarkers(this.sitesSubset() ?? []);
    }
  }

  protected toList(): List<MapMarkerOptions> {
    return List(this.markers() ?? []);
  }

  private getFilter(pagingFilters: Filters<ISite>): Filters<Site> {
    let modelFilters: InnerFilter<Site> = {};

    if (this.sitesSubset()?.length) {
      const siteIds = this.sitesSubset().map((site) => site.id);
      modelFilters = { id: { in: siteIds } };
    } else if (this.regions()?.length) {
      const regionIds = this.regions().map((region) => region.id);
      modelFilters = { "regions.id": { in: regionIds } } as InnerFilter<Site>;
    } else if (this.projects()?.length) {
      const projectIds = this.projects().map((project) => project.id);
      modelFilters = { "projects.id": { in: projectIds } } as InnerFilter<Site>;
    }

    return {
      ...pagingFilters,
      filter: modelFilters,
    };
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    const sanitizedMarkers = sanitizeMapMarkers(sites.map((site) => site.getMapMarker()));
    this.markers.update((current) => current.concat(sanitizedMarkers));
  }
}
