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
import { MapMarkerOptions } from "@services/maps/maps.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { MockModule } from "ng-mocks";
import { GoogleMapsModule } from "@angular/google-maps";
import { of } from "rxjs";
import { SiteMapComponent } from "./site-map.component";

describe("SiteMapComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let spec: Spectator<SiteMapComponent>;
  let injector: AssociationInjector;

  const defaultProjects: Project[] = [new Project(generateProject(), injector)];
  const defaultRegions: Region[] = [new Region(generateRegion(), injector)];
  const defaultSites: Site[] = [new Site(generateSite(), injector)];

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
  }

  function setComponentProps(
    projects?: Project[],
    regions?: Region[],
    sites?: Site[],
  ): void {
    // This function will trigger change detection because setInput calls
    // detectChanges.
    // https://github.com/ngneat/spectator/blob/549c63c43e/projects/spectator/src/lib/spectator/spectator.ts#L50-L53
    spec.setInput({
      projects,
      regions,
      sites,
    });
  }

  function generateSites(numSites: number, overrides: ISite = {}): Site[] {
    return Array.from({ length: numSites }).map(
      () => new Site(generateSite(overrides), injector),
    );
  }

  function generateMarkers(allSites: Site[]) {
    const markers: MapMarkerOptions[] = [];
    markers.push(...allSites.map((site) => site.getMapMarker()));
    return markers;
  }

  function assertMapMarkers(allSites: Site[]) {
    expect(getMapMarkers()).toEqual(generateMarkers(allSites));
  }

  function getMapMarkers() {
    return spec.query(MapComponent).markers().toArray();
  }

  xit("should handle error", () => {
    setup([generateBawApiError() as any]);
    spec.detectChanges();

    expect(getMapMarkers()).toEqual([]);
  });

  describe("markers", () => {
    it("should display map placeholder box when no sites found", () => {
      setup([]);
      spec.detectChanges();

      assertMapMarkers([]);
    });

    it("should display map marker for a single site", () => {
      const sites = generateSites(1);
      setup(sites);
      setComponentProps(defaultProjects);

      assertMapMarkers(sites);
    });

    it("should display map markers for all sites over multiple pages", () => {
      const sites = generateSites(100);
      setup(sites);
      setComponentProps(defaultProjects);

      assertMapMarkers(sites);
    });

    it("should remove map markers without a location", () => {
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
    });
  });

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
          }
        },
      },
      {
        name: "should use correct filter for a region",
        regions: defaultRegions,
        expectedFilter: {
          "regions.id": {
            in: defaultRegions.map((region) => region.id),
          }
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
              }
            },
            {
              "regions.id": {
                in: defaultRegions.map((region) => region.id),
              }
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
              }
            },
            {
              "regions.id": {
                in: defaultRegions.map((region) => region.id),
              }
            },
            {
              "id": {
                in: defaultSites.map((site) => site.id),
              }
            },
          ],
        } as any,
      },
      {
        name: "should do an unfiltered api request if no projects, regions, or sites are provided",
        projects: [],
        regions: [],
        sites: [],
        expectedFilter: {},
      },
    ];

    for (const testCase of tests) {
      it(testCase.name, async () => {
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
      });
    }

    describe("sites", () => {
      it("should not call the filter api if only a site is provided", () => {
        setup(generateSites(2));
        setComponentProps(undefined, undefined, defaultSites);

        expect(api.filter).not.toHaveBeenCalled();
      });
    });
  });
});
