import { Component, Input, OnChanges } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { SitesService } from "@baw-api/site/sites.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
import { merge, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { MapComponent } from "../../../shared/map/map.component";

@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="markers"></baw-map>',
  imports: [MapComponent],
})
export class SiteMapComponent extends withUnsubscribe() implements OnChanges {
  // TODO Implement system to change colour of selected sites
  @Input() public selected: List<Site>;
  @Input() public project: Project;
  @Input() public region: Region;
  /** Display a subset of sites from the project/region */
  @Input() public sitesSubset: Site[] = [];
  public markers: List<MapMarkerOptions> = List([]);

  public constructor(private sitesApi: SitesService) {
    super();
  }

  // using ngOnChanges instead of ngOnInit for reactivity
  // this allows us to dynamically update the projects, regions, sites, etc... without destroying the entire component
  public ngOnChanges(): void {
    const filters: Filters<ISite> = { paging: { page: 1 } };

    this.markers = List([]);

    // we use a falsy assertion for sitesSubset here because if sitesSubset is undefined or the length is zero
    // we want to fetch all markers for the project/region
    if ((this.project || this.region) && !this.sitesSubset?.length) {
      this.getFilter(filters, this.project, this.region)
        .pipe(
          switchMap((models: Site[]) => this.getMarkers(models)),
          takeUntil(this.unsubscribe),
        )
        .subscribe({
          next: (sites: Site[]) => this.pushMarkers(sites),
          error: () => this.pushMarkers([]),
        });
    }

    this.pushMarkers(this.sitesSubset ?? []);
  }

  private getFilter(
    filters: Filters<ISite>,
    project: Project,
    region?: Region,
  ): Observable<Site[]> {
    return this.region
      ? this.sitesApi.filterByRegion(filters, project, region)
      : this.sitesApi.filter(filters, project);
  }

  /**
   * Retrieve map markers from api
   */
  private getMarkers(sites: Site[]): Observable<Site[]> {
    const numPages = sites?.[0]?.getMetadata()?.paging?.maxPage || 1;
    const observables: Observable<Site[]>[] = [];

    // Can skip first page because initial filter produces the results
    for (let page = 2; page <= numPages; page++) {
      observables.push(
        this.getFilter({ paging: { page } }, this.project, this.region),
      );
    }

    this.pushMarkers(sites);
    return merge(...observables);
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    this.markers = this.markers.concat(
      sanitizeMapMarkers(sites.map((site) => site.getMapMarker())),
    );
  }
}
