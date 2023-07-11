import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
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
  template: '<baw-map style="width: 100%; height: 100%;" [markers]="markers"></baw-map>',
})
export class SiteMapComponent
  extends withUnsubscribe()
  implements OnInit, OnChanges
{
  // TODO Implement system to change colour of selected sites
  @Input() public selected: List<Site>;
  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public sites: Site[];
  public markers: List<MapMarkerOptions> = List([]);

  public constructor(private sitesApi: SitesService) {
    super();
  }

  public ngOnInit(): void {
    const filters: Filters<ISite> = { paging: { page: 1 } };

    if (this.project || this.region) {
      this.getFilter(filters, this.project, this.region)
        .pipe(
          switchMap((models) => this.getMarkers(models)),
          takeUntil(this.unsubscribe)
        )
        .subscribe({
          next: (sites) => this.pushMarkers(sites),
          error: () => this.pushMarkers([]),
        });
    }
  }

  public ngOnChanges(): void {
    this.pushMarkers(this.sites ?? []);
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
      sanitizeMapMarkers(sites.map((site) => site.getMapMarker()))
    );
  }
}
