import { Component, Input, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { SitesService } from "@baw-api/site/sites.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import {
  MapMarkerOptions,
  sanitizeMapMarkers,
} from "@shared/map/map.component";
import { List } from "immutable";
import { merge, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="markers"></baw-map>',
})
export class SiteMapComponent extends withUnsubscribe() implements OnInit {
  // TODO Implement system to change colour of selected sites
  @Input() public selected: List<Site>;
  @Input() public projects: Project[];
  @Input() public regions: Region[];
  public markers: List<MapMarkerOptions> = List([]);

  public constructor(private sitesApi: SitesService) {
    super();
  }

  public ngOnInit(): void {
    this.regions?.forEach((region) => this.addSingleLocationMarkers(this.projects.pop(), region));
    this.projects?.forEach((project) => this.addSingleLocationMarkers(project));
  }

  /**
   * Fetches the markers for a project or region and adds the markers to the `markers` list for a single location
   */
  private addSingleLocationMarkers(project?: Project, region?: Region): void {
    const filters: Filters<ISite> = { paging: { page: 1 } };

    this.getFilter(filters, project, region)
      .pipe(
        switchMap((models) => this.getMarkers(models, project, region)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (sites) => this.pushMarkers(sites),
        error: () => this.pushMarkers([]),
      });
  }

  private getFilter(
    filters: Filters<ISite>,
    project: Project,
    region?: Region
  ): Observable<Site[]> {
    // since the region parameter is optional, if a region is not specified, it will default to undefined
    // and will have the same result as `siteApi.filter()`
    return this.sitesApi.filterByRegion(filters, project, region)
  }

  /**
   * Retrieve map markers from api
   */
  private getMarkers(
    sites: Site[],
    project: Project,
    region: Region
  ): Observable<Site[]> {
    const numPages = sites?.[0]?.getMetadata()?.paging?.maxPage || 1;
    const observables: Observable<Site[]>[] = [];

    // Can skip first page because initial filter produces the results
    for (let page = 2; page <= numPages; page++) {
      observables.push(this.getFilter({ paging: { page } }, project, region));
    }

    this.pushMarkers(sites);
    return merge(...observables);
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    this.markers = this.markers.concat(
      sanitizeMapMarkers(sites.map((site) => site.getMapMarker()))
    );
  }
}
