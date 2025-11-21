import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { MapComponent } from "@shared/map/map.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { MockModule } from "ng-mocks";
import { GoogleMapsModule } from "@angular/google-maps";
import { of } from "rxjs";
import { IdOr } from "@baw-api/api-common";
import { MapsService } from "@services/maps/maps.service";
import { fakeAsync, flush } from "@angular/core/testing";
import { SiteMapComponent } from "./site-map.component";

describe("SiteMapComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let spec: Spectator<SiteMapComponent>;
  let injector: AssociationInjector;

  const defaultProjects: Project[] = [new Project(generateProject(), injector)];
  const defaultRegions: Region[] = [new Region(generateRegion(), injector)];
  const defaultSites: Site[] = [new Site(generateSite(), injector)];

  const mapComponent = () => spec.query(MapComponent);

  const createComponent = createComponentFactory({
    component: SiteMapComponent,
    imports: [MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi()],
  });

  function setup(mockSites: Site[]): void {
    spec = createComponent({ detectChanges: false });

    api = spec.inject(ShallowSitesService);
    injector = spec.inject(ASSOCIATION_INJECTOR);

    api.filter.and.returnValue(of(mockSites));

    const mapsService = spec.inject(MapsService);
    spyOn(mapsService, "loadAsync").and.returnValue(Promise.resolve(true));
  }

  function setComponentProps(
    projects?: IdOr<Project>[],
    regions?: IdOr<Region>[],
    sites?: IdOr<Site>[],
  ): void {
    // This function will trigger change detection because setInput calls
    // detectChanges.
    // https://github.com/ngneat/spectator/blob/549c63c43e/projects/spectator/src/lib/spectator/spectator.ts#L50-L53
    spec.setInput({
      projects,
      regions,
      sites,
    });

    flush();
    spec.detectChanges();
  }

  function setGroupBy(key: string) {
    spec.setInput("groupBy", key);
    flush();
    spec.detectChanges();
  }

  function generateSites(numSites: number, overrides: ISite = {}): Site[] {
    return Array.from({ length: numSites }).map(
      () => new Site(generateSite(overrides), injector),
    );
  }

  function assertMapMarkers(allSites: Site[]) {
    const siteMarkers = allSites.map((site) => site.getMapMarker());
    expect(mapMarkers()).toEqual(siteMarkers);
  }

  function mapMarkers() {
    return mapComponent().markers().toArray();
  }

  it("should handle error", fakeAsync(() => {
    setup([generateBawApiError() as any]);
    spec.detectChanges();

    expect(mapMarkers()).toEqual([]);
  }));

  describe("markers", () => {
    it("should display map placeholder box when no sites found", fakeAsync(() => {
      setup([]);
      spec.detectChanges();

      assertMapMarkers([]);
      expect(mapComponent().hasMarkers).toBeFalse();
    }));

    it("should display map marker for a single site", fakeAsync(() => {
      const sites = generateSites(1);
      setup(sites);
      setComponentProps(defaultProjects);

      assertMapMarkers(sites);
    }));

    it("should display map markers for all sites over multiple pages", fakeAsync(() => {
      const sites = generateSites(100);
      setup(sites);
      setComponentProps(defaultProjects);

      assertMapMarkers(sites);
    }));

    it("should remove map markers without a location", fakeAsync(() => {
      const noLocationSites = generateSites(100, {
        latitude: undefined,
        longitude: undefined,
        customLatitude: undefined,
        customLongitude: undefined,
      });

      const sitesWithLocation = generateSites(10);

      const sitesUnion = noLocationSites.concat(sitesWithLocation);

      setup(sitesUnion);
      setComponentProps(defaultProjects);

      assertMapMarkers(sitesWithLocation);
    }));
  });

  // Explicitly passing in empty array is different from not providing projects,
  // regions, or sites at all (in which case we show all sites).
  // If no projects, regions, or sites are explicitly provided with an empty
  // array, then we should not make any API calls and just show no sites.
  it("should not make any api calls if only empty arrays are provided", fakeAsync(() => {
    setup([]);
    setComponentProps([], [], []);

    expect(api.filter).not.toHaveBeenCalled();
    assertMapMarkers([]);
  }));

  describe("api", () => {
    interface FilterTestCase {
      name: string;
      projects?: Project[];
      regions?: Region[];
      sites?: Site[];

      // I use "any" here because the filtering types don't currently support
      // associations, which would mean that I would have to manually type cast
      // most of the expected filters.
      expectedFilter?: InnerFilter<any>;
    }

    const tests: FilterTestCase[] = [
      {
        name: "should use correct filter for a single project",
        projects: defaultProjects,
        expectedFilter: {
          "projects.id": {
            in: defaultProjects.map((project) => project.id),
          },
        },
      },
      {
        name: "should use correct filter for a region",
        regions: defaultRegions,
        expectedFilter: {
          "regions.id": {
            in: defaultRegions.map((region) => region.id),
          },
        },
      },
      {
        name: "should use correct filter for projects and regions",
        projects: defaultProjects,
        regions: defaultRegions,
        expectedFilter: {
          or: [
            {
              "projects.id": {
                in: defaultProjects.map((project) => project.id),
              },
            },
            {
              "regions.id": {
                in: defaultRegions.map((region) => region.id),
              },
            },
          ],
        } as any,
      },
      {
        // Unlike only having sites, if there are also projects and regions
        // provided, we still need to call the API to get all sites for the
        // projects and regions.
        name: "should use correct filter for projects, regions, and sites",
        projects: defaultProjects,
        regions: defaultRegions,
        sites: defaultSites,
        expectedFilter: {
          or: [
            {
              "projects.id": {
                in: defaultProjects.map((project) => project.id),
              },
            },
            {
              "regions.id": {
                in: defaultRegions.map((region) => region.id),
              },
            },
            {
              id: {
                in: defaultSites.map((site) => site.id),
              },
            },
          ],
        } as any,
      },
      {
        name: "should do an unfiltered api request if no projects, regions, or sites are provided",
        projects: undefined,
        regions: undefined,
        sites: undefined,
        expectedFilter: {},
      },
    ];

    for (const testCase of tests) {
      it(testCase.name, fakeAsync(() => {
        const sites = generateSites(20);
        setup(sites);
        setComponentProps(testCase.projects, testCase.regions, testCase.sites);

        const expectedFilters: Filters<Site> = {
          filter: testCase.expectedFilter,
          paging: { disablePaging: true },
          projection: {
            include: ["name", "customLatitude", "customLongitude"],
          },
        };

        expect(api.filter).toHaveBeenCalledOnceWith(expectedFilters);
      }));
    }

    describe("sites", () => {
      // If only site models are provided, then we don't need to call the API
      // because we already have all the site information we need.
      it("should not call the filter api if only a site model is provided", fakeAsync(() => {
        const sites = generateSites(2);
        setup(sites);
        setComponentProps(undefined, undefined, sites);

        expect(api.filter).not.toHaveBeenCalled();

        // We should still see the markers on the map.
        assertMapMarkers(sites);
      }));

      // Although only sites are provided, they are not full site models, so we
      // do not have the lat/long information needed to place the markers on the
      // map.
      // Therefore, we still need to call the API to convert the site ids into
      // site models.
      it("should call the filter api if only site ids are provided", fakeAsync(() => {
        const sites = generateSites(2);
        const siteIds = sites.map((site) => site.id);

        setup(sites);
        setComponentProps(undefined, undefined, siteIds);

        const expectedFilters: Filters<Site> = {
          filter: {
            id: {
              in: siteIds,
            },
          },
          paging: { disablePaging: true },
          projection: {
            include: ["name", "customLatitude", "customLongitude"],
          },
        };

        expect(api.filter).toHaveBeenCalledOnceWith(expectedFilters);
      }));

      it("should not make any api calls if only an empty site array is provided", fakeAsync(() => {
        setup([]);
        setComponentProps(undefined, undefined, []);

        expect(api.filter).not.toHaveBeenCalled();
        assertMapMarkers([]);
      }));
    });
  });

  describe("updates", () => {
    it("should correctly replace site markers on a map", fakeAsync(() => {
      // I purposely make the new sites smaller than the initial sites, so
      // if there is a bug where the markers are not cleared properly, the test
      // will fail.
      const initialSites = generateSites(8);
      const newSites = generateSites(3);

      setup(initialSites);
      setComponentProps(undefined, undefined, initialSites);

      // This assertion is just to make sure our test setup is correct.
      // This behavior has been asserted in other tests.
      assertMapMarkers(initialSites);

      // On update, the site map will make a new call to the sites service to
      // get the new sites.
      api.filter.calls.reset();
      api.filter.and.returnValue(of(newSites));

      setComponentProps(defaultProjects, undefined, newSites);
      assertMapMarkers(newSites);

      const expectedFilters: InnerFilter<Site> = {
        or: [
          {
            "projects.id": {
              in: defaultProjects.map((project) => project.id),
            },
          },
          {
            id: {
              in: newSites.map((site) => site.id),
            },
          },
        ],
      };

      expect(api.filter).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ filter: expectedFilters }),
      );
    }));

    it("should correctly transition from a 'no sites' state to showing sites", fakeAsync(() => {
      const newSites = generateSites(5);

      setup([]);
      setComponentProps(undefined, undefined, []);
      assertMapMarkers([]);

      api.filter.calls.reset();
      api.filter.and.returnValue(of(newSites));

      setComponentProps(defaultProjects, undefined, newSites);
      assertMapMarkers(newSites);
    }));
  });

  describe("grouping", () => {
    it("should include grouping identifier in filter projection", fakeAsync(() => {
      setup(generateSites(2));

      api.filter.calls.reset();
      setGroupBy("regionId");

      expect(api.filter).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          projection: jasmine.objectContaining({
            include: jasmine.arrayContaining(["regionId"]),
          }),
        }),
      );
    }));

    it("should correctly group sites by the groupBy input", fakeAsync(() => {
      const sites = [
        new Site(generateSite({ regionId: 1 }), injector),
        new Site(generateSite({ regionId: 1 }), injector),
        new Site(generateSite({ regionId: 2 }), injector),
        new Site(generateSite({ regionId: 2 }), injector),
        new Site(generateSite({ regionId: 3 }), injector),
        new Site(generateSite({ regionId: 4 }), injector),
      ];

      setup(sites);
      setGroupBy("regionId");

      const markers = mapMarkers();

      expect(markers).toHaveLength(6);

      const markerGroups = markers.map((marker) => marker.groupId);
      expect(markerGroups).toEqual([ 1, 1, 2, 2, 3, 4 ]);
    }));
  });
});
