import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from "@angular/core";
import { IdOr } from "@baw-api/api-common";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { filterModelIds, filterOr } from "@helpers/filters/filters";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers, MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";

// TODO Implement system to change colour of selected sites
/**
 * @description
 * A site map that will show the union (OR) of sites assigned to the provided
 * projects, regions, and sites.
 */
@Component({
  selector: "baw-site-map",
  template: '<baw-map [markers]="markers()"></baw-map>',
  imports: [MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteMapComponent extends withUnsubscribe() implements OnChanges {
  private readonly sitesApi = inject(ShallowSitesService);

  public readonly projects = input<IdOr<Project>[]>([]);
  public readonly regions = input<IdOr<Region>[]>([]);
  public readonly sites = input<IdOr<Site>[]>([]);
  public readonly selected = input<List<IdOr<Site>>>();

  protected markers = signal(List<MapMarkerOptions>());

  // using ngOnChanges instead of ngOnInit for reactivity
  // this allows us to dynamically update the projects, regions, sites, etc... without destroying the entire component
  public ngOnChanges(): void {
    const sites = this.sites();
    if (this.hasAllSiteModels(sites)) {
      this.pushMarkers(sites);
      return;
    }

    const filters: Filters<Site> = {
      filter: this.getFilter(),
      paging: { disablePaging: true },
      projection: {
        include: ["name", "customLatitude", "customLongitude"],
      },
    };

    this.sitesApi
      .filter(filters)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (siteLocations: Site[]) => this.pushMarkers(siteLocations),
        error: (err) => {
          this.markers.set(List());
          throw new Error("Failed to load sites for map", { cause: err });
        },
      });
  }

  private modelIds<const T extends IdOr<Project | Region | Site>>(
    models: T[],
  ): Id[] {
    let areIds = false;

    return models.map((model) => {
      if (typeof model === "number") {
        areIds = true;
        return model;
      }

      if (areIds) {
        throw new Error(
          "Mixed model and id array provided to SiteMapComponent",
        );
      }

      return model.id;
    });
  }

  private hasAllSiteModels(sites?: IdOr<Site>[]): sites is Site[] {
    return (
      !this.projects()?.length &&
      !this.regions()?.length &&
      sites?.length &&
      sites?.every((site) => typeof site !== "number")
    );
  }

  /**
   * Creates an API filter that will filter sites based on the provided
   * projects, regions, and sites.
   */
  private getFilter(): InnerFilter<Site> {
    let filter: InnerFilter<Site> = {};

    if (this.projects()?.length) {
      const projectIds = this.modelIds(this.projects());
      const projectFilters = filterModelIds<Site>("projects", projectIds);

      filter = filterOr(filter, projectFilters);
    }

    if (this.regions()?.length) {
      const regionIds = this.modelIds(this.regions());
      const regionFilters = filterModelIds<Site>("regions", regionIds);

      filter = filterOr(filter, regionFilters);
    }

    if (this.sites()?.length) {
      const siteIds = this.modelIds(this.sites());
      filter = filterOr(filter, { id: { in: siteIds } });
    }

    return filter;
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    const newMarkers = sanitizeMapMarkers(
      sites.map((site) => site.getMapMarker()),
    );
    this.markers.update((current) => current.concat(newMarkers));
  }
}
