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
import { filterAnd, filterModelIds, filterOr } from "@helpers/filters/filters";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Id } from "@interfaces/apiInterfaces";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { sanitizeMapMarkers, MapComponent } from "@shared/map/map.component";
import { List } from "immutable";
import { timer } from "rxjs";
import { first, takeUntil } from "rxjs/operators";
import { defaultSlowLoadTime, IS_SERVER_PLATFORM } from "src/app/app.helper";

// TODO Implement system to change colour of selected sites
/**
 * @description
 * A site map that will show the union (OR) of sites assigned to the provided
 * projects, regions, and sites.
 */
@Component({
  selector: "baw-site-map",
  template: `
    <baw-map
      [markers]="markers()"
      [fetchingData]="isFetching()"
    ></baw-map>
  `,
  styleUrl: "./site-map.component.scss",
  imports: [MapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // You can use the "loaded" class to style the map differently after it has
    // loaded.
    "[class.loaded]": "!isFetching()",
  },
})
export class SiteMapComponent extends withUnsubscribe() implements OnChanges {
  private readonly sitesApi = inject(ShallowSitesService);
  private readonly isServer = inject(IS_SERVER_PLATFORM);

  public readonly projects = input<IdOr<Project>[]>();
  public readonly regions = input<IdOr<Region>[]>();
  public readonly sites = input<IdOr<Site>[]>();
  public readonly selected = input<List<IdOr<Site>>>();
  public readonly filters = input<InnerFilter<Site>>();
  public readonly groupBy = input<keyof Site | undefined>();

  protected readonly markers = signal(List<MapMarkerOptions>());
  protected readonly isFetching = signal(true);
  protected readonly groups = signal<unknown[]>([]);

  // Using ngOnChanges instead of ngOnInit for reactivity
  // this allows us to dynamically update the projects, regions, sites, etc...
  // without destroying the entire component
  public ngOnChanges(): void {
    this.refreshSiteMarkers();
  }

  /**
   * @description
   * Re-fetches site markers based on the current inputs
   */
  private refreshSiteMarkers(): void {
    // We don't attempt to render the site map during SSR because the sites
    // shown are almost always dependent on the users authenticated session,
    // which is not available during SSR.
    if (this.isServer) {
      return;
    }

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

    if (this.groupBy()) {
      filters.projection.include.push(this.groupBy());
    }

    const request$ = this.sitesApi
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe));

    // For fast requests, we don't want to flash a loading state.
    // However, if fetching takes a long time, we do want to show a loading
    // state to inform the user that something is happening.
    const timerSub = timer(defaultSlowLoadTime)
      .pipe(takeUntil(this.unsubscribe), takeUntil(request$))
      .subscribe(() => this.isFetching.set(true));

    // takeUntil is specified above as this.unsubscribe
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    request$.subscribe({
      next: (siteLocations: Site[]) => {
        // cancel the timer if it hasn't fired yet
        if (!this.isFetching()) {
          timerSub.unsubscribe();
        }
        this.pushMarkers(siteLocations);
        this.isFetching.set(false);
      },
      error: (err) => {
        timerSub.unsubscribe();
        this.markers.set(List());
        this.isFetching.set(false);
        throw new Error("Failed to load sites for map", { cause: err });
      },
    });
  }

  private modelIds<const T extends IdOr<Project | Region | Site>>(
    models: T[],
  ): Id[] {
    return models.map((model) => {
      if (typeof model === "number") {
        return model;
      }

      return model.id;
    });
  }

  /**
   * @description
   * A method that check if all input models (projects, regions, site) have
   * enough information to create map markers without an API call.
   */
  private hasAllSiteModels(sites?: IdOr<Site>[]): sites is Site[] {
    // If there are no inputs, we return "false" so that the component can do
    // an unfiltered API call and show all sites.
    //
    // This is different from the case where empty arrays are provided as
    // inputs, in which case we want to show no sites.
    if (
      this.projects() === undefined &&
      this.regions() === undefined &&
      this.sites() === undefined
    ) {
      return false;
    }

    // If there are project or region inputs, we need to make an API call.
    // The only time that we can avoid an API call is when component consumer
    // provides only site models with full information.
    return (
      !this.projects()?.length &&
      !this.regions()?.length &&
      sites?.every((site) => typeof site !== "number")
    );
  }

  /**
   * Creates an API filter that will filter sites based on the provided
   * projects, regions, and sites.
   * Inputs are combined using OR logic.
   */
  private getFilter(): InnerFilter<Site> {
    let siteFilters: InnerFilter<Site> = {};

    if (this.projects()) {
      const projectIds = this.modelIds(this.projects());
      const projectFilters = filterModelIds<Site>("projects", projectIds);

      siteFilters = filterOr(siteFilters, projectFilters);
    }

    if (this.regions()) {
      const regionIds = this.modelIds(this.regions());
      const regionFilters = filterModelIds<Site>("regions", regionIds);

      siteFilters = filterOr(siteFilters, regionFilters);
    }

    if (this.sites()) {
      const siteIds = this.modelIds(this.sites());
      siteFilters = filterOr(siteFilters, { id: { in: siteIds } });
    }

    return filterAnd(siteFilters, this.filters());
  }

  /**
   * Push new sites to markers list
   */
  private pushMarkers(sites: Site[]): void {
    this.groups.set([]);

    if (this.groupBy()) {
      const groups = new Set<unknown>();
      sites.forEach((site) => {
        groups.add(site[this.groupBy()]);
      });

      this.groups.set(Array.from(groups));
    }

    const newMarkers = sanitizeMapMarkers(
      sites.map((site) => {
        const marker = site.getMapMarker()
        if (this.groupBy() && marker) {
          marker.groupId = site[this.groupBy()];
        }

        return marker;
      }),
    );

    this.markers.set(newMarkers);
  }
}
