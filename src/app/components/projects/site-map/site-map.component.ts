import { Component, Input, OnInit } from "@angular/core";
import { SitesService } from "@baw-api/site/sites.service";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
import { merge, noop, Observable } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-site-map",
  template: `<baw-map [markers]="markers"></baw-map>`,
})
export class SiteMapComponent extends WithUnsubscribe() implements OnInit {
  // TODO Implement system to change colour of selected sites
  @Input() public selected: List<Site>;
  @Input() public project: Project;
  public markers: List<MapMarkerOption> = List([]);

  constructor(private sitesApi: SitesService) {
    super();
  }

  public ngOnInit(): void {
    this.sitesApi
      .filter({ paging: { page: 1 } }, this.project)
      .pipe(
        switchMap((models) => this.getMarkers(models)),
        takeUntil(this.unsubscribe)
      )
      .subscribe((sites) => this.pushMarkers(sites), noop);
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
        this.sitesApi.filter({ paging: { page } }, this.project)
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
