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
  @Input() public unstructuredLocations: List<Project | Region> | undefined;
  @Input() public projects: Project[] | undefined;
  @Input() public regions: Region[] | undefined;
  public markers: List<MapMarkerOptions> = List([]);

  public constructor(private sitesApi: SitesService) {
    super();
  }

  public ngOnInit(): void {
    // sometimes an unstructured array of locations can be passed to the map component
    // therefore, it is necessary that the data is structured before
    if (this.unstructuredLocations) {
      const locationsArray = this.unstructuredLocations.toArray();

      locationsArray.forEach((location) => {
        if (location["type"] === "Region") {
          if (!this.regions) {
            this.regions = [];
          }

          this.regions.push(location as Region);
        } else {
          if (!this.projects) {
            this.projects = [];
          }

          this.projects.push(location as Project);
        }
      });
    }

    // a list of regions will only ever have one project, while a project will never have a region
    // therefore, we can decide how to iterate through a list of items on the predicate if there is a region
    if (this.regions) {
      this.regions.forEach((region) => {
        this.addSingleLocationMarkers(this.projects[0], region);
      });
    } else {
      this.projects.forEach((project) => {
        this.addSingleLocationMarkers(project, undefined);
      });
    }
  }

  /**
   * Fetches the markers and adds the markers to the `markers` list for a single location
   * e.g. A project or region
   */
  private addSingleLocationMarkers(project: Project, region: Region): void {
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
    project: Project | undefined,
    region?: Region | undefined
  ): Observable<Site[]> {
    return this.regions
      ? this.sitesApi.filterByRegion(filters, project, region)
      : this.sitesApi.filter(filters, project);
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
