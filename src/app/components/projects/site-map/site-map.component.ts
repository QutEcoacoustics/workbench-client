import { Component, Input, OnInit } from "@angular/core";
import { Filters } from "@baw-api/baw-api.service";
import { SitesService } from "@baw-api/site/sites.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import { MapMarkerOption, MapService } from "@services/map/map.service";
import { List } from "immutable";
import { merge, noop, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="markers"></baw-map>',
})
export class SiteMapComponent extends withUnsubscribe() implements OnInit {
  // TODO Implement system to change colour of selected sites
  @Input() public selected: List<Site>;
  @Input() public project: Project;
  @Input() public region: Region;
  public markers: List<MapMarkerOption> = List([]);

  public constructor(private sitesApi: SitesService, private map: MapService) {
    super();
  }

  public ngOnInit(): void {
    const filters: Filters<ISite> = { paging: { page: 1 } };

    this.getFilter(filters, this.project, this.region)
      .pipe(
        switchMap((models) => this.getMarkers(models)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((sites) => this.pushMarkers(sites), noop);
  }

  private getFilter(
    filters: Filters<ISite>,
    project: Project,
    region?: Region
  ) {
    return this.region
      ? this.sitesApi.filterByRegion(filters, project, region)
      : this.sitesApi.filter(filters, project);
  }

  /**
   * Retrieve map markers from api
   */
  private getMarkers(sites: Site[]) {
    const numPages = sites?.[0]?.getMetadata()?.paging?.maxPage || 1;
    const observables: Observable<Site[]>[] = [];

    // Can skip first page because initial filter produces the results
    for (let page = 2; page <= numPages; page++) {
      observables.push(
        this.getFilter({ paging: { page } }, this.project, this.region)
      );
    }

    this.pushMarkers(sites);
    return merge(...observables);
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]) {
    this.markers = this.markers.concat(
      this.map.sanitizeMarkers(sites.map((site) => site.getMapMarker()))
    );
  }
}
