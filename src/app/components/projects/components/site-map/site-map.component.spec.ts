import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Errorable } from "@helpers/advancedTypes";
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
import { interceptFilterApiRequest } from "@test/helpers/general";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { MapMarkerOptions } from "@services/maps/maps.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { MockModule } from "ng-mocks";
import { GoogleMapsModule } from "@angular/google-maps";
import { SiteMapComponent } from "./site-map.component";

describe("SiteMapComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let spec: Spectator<SiteMapComponent>;
  let injector: AssociationInjector;

  let defaultProjects: Project[];
  let defaultRegions: Region[];
  let defaultSites: Site[];

  const createComponent = createComponentFactory({
    component: SiteMapComponent,
    imports: [MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {});

  function setup(): void {
    spec = createComponent({ detectChanges: false });

    api = spec.inject(ShallowSitesService);
    injector = spec.inject(ASSOCIATION_INJECTOR);

    defaultProjects = [new Project(generateProject(), injector)];
    defaultRegions = [new Region(generateRegion(), injector)];
    defaultSites = [new Site(generateSite(), injector)];
  }

  function setComponentProps(
    projects?: Project[],
    regions?: Region[],
    sites?: Site[],
  ): void {
    if (projects) {
      spec.setInput("projects", projects);
    }

    if (regions) {
      spec.setInput("regions", regions);
    }

    if (sites) {
      spec.setInput("sites", sites);
    }
  }

  function generateSites(numSites: number, overrides: ISite = {}): Site[] {
    return Array.from({ length: numSites })
      .fill(null)
      .map(() => {
        return new Site(generateSite(overrides));
      });
  }

  function generateMarkers(allSites: Site[]) {
    const markers: MapMarkerOptions[] = [];
    markers.push(...allSites.map((site) => site.getMapMarker()));
    return markers;
  }

  function getMapMarkers() {
    return spec.query(MapComponent).markers().toArray();
  }

  function interceptApiRequest(responses: Errorable<Site>[]): Promise<any> {
    return interceptFilterApiRequest(api, injector, responses, Site);
  }

  async function assertMapMarkers(promise: Promise<any>, allSites: Site[]) {
    spec.detectChanges();
    await promise;
    spec.detectChanges();
    expect(getMapMarkers()).toEqual(generateMarkers(allSites));
  }

  it("should handle error", async () => {
    setup();
    const promise = interceptApiRequest([generateBawApiError()]);
    await assertMapMarkers(promise, []);
  });

  describe("markers", () => {
    beforeEach(() => {
      setup();
    });

    it("should display map placeholder box when no sites found", async () => {
      const promise = interceptApiRequest([]);
      await assertMapMarkers(promise, []);
    });

    it("should display map marker for a single site", async () => {
      const sites = generateSites(1);
      const promise = interceptApiRequest(sites);
      setComponentProps(defaultProjects);
      await assertMapMarkers(promise, sites);
    });

    it("should display map markers for all sites over multiple pages", async () => {
      const sites = generateSites(100);
      const promise = interceptApiRequest(sites);
      setComponentProps(defaultProjects);
      await assertMapMarkers(promise, sites);
    });

    it("should remove map markers without a location", async () => {
      const noLocationSites = generateSites(100, {
        latitude: undefined,
        longitude: undefined,
        customLatitude: undefined,
        customLongitude: undefined,
      });

      const sitesWithLocation = generateSites(10);

      const sitesUnion = noLocationSites.concat(sitesWithLocation);

      const promise = interceptApiRequest(sitesUnion);
      setComponentProps(defaultProjects);
      await assertMapMarkers(promise, sitesWithLocation);
    });
  });

  describe("api", () => {
    interface FilterTestCase {
      name: string;
      projects?: Project[];
      regions?: Region[];
      sites?: Site[];
    }

    function assertFilter(
      projects?: Project[],
      regions?: Region[],
      _sites?: Site[],
    ) {
      const expectedFilters: Filters<Site> = {
        paging: { disablePaging: true },
        filter: {},
      };

      if (regions) {
        expectedFilters.filter = {
          "regions.id": { in: regions.map((region) => region.id) },
        } as InnerFilter<Site>;
      } else if (projects) {
        expectedFilters.filter = {
          "projects.id": { in: projects.map((project) => project.id) },
        } as InnerFilter<Site>;
      }

      expect(api.filter).toHaveBeenCalledOnceWith(expectedFilters);
    }

    async function runFilterTest(testCase: FilterTestCase) {
      setup();

      setComponentProps(testCase.projects, testCase.regions, testCase.sites);

      const sites = generateSites(20);
      const promise = interceptApiRequest(sites);

      spec.detectChanges();
      await promise;
      spec.detectChanges();

      assertFilter(testCase.projects, testCase.regions, testCase.sites);
    }

    const tests: FilterTestCase[] = [
      {
        name: "should use correct filter for a single project",
        projects: defaultProjects,
      },
      {
        name: "should use correct filter for a single region",
        projects: defaultProjects,
        regions: defaultRegions,
      },
      {
        name: "should make the correct filter call for a single site",
        projects: defaultProjects,
        regions: defaultRegions,
        sites: defaultSites,
      },
      {
        name: "should make the correct filter when there is a site without project or region",
        sites: defaultSites,
      },
      {
        name: "should make an unfiltered api call if there are no projects, regions, or sites",
      },
    ];

    for (const testCase of tests) {
      it(testCase.name, async () => {
        await runFilterTest(testCase);
      });
    }
  });
});
