import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SitesService } from "@baw-api/site/sites.service";
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
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { interceptRepeatApiRequests } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { SiteMapComponent } from "./site-map.component";

const mockMap = MockComponent(MapComponent);

describe("SiteMapComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let api: SpyObject<SitesService>;
  let spec: Spectator<SiteMapComponent>;
  const createComponent = createComponentFactory({
    component: SiteMapComponent,
    declarations: [mockMap],
    imports: [SharedModule, MockBawApiModule],
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  function setup(project: Project, region?: Region) {
    spec = createComponent({
      detectChanges: false,
      props: { projects: project, regions: region },
    });
    api = spec.inject(SitesService);
  }

  function generatePagedSites(
    numSites: number,
    overrides: ISite = {}
  ): Site[][] {
    /**
     * Calculate page number for site position. Page numbers begin from 1
     */
    function calculatePage(sitePosition: number) {
      // When site position equals defaultApiPageSize, it should not
      // go into the next page. Hence the defaultApiPageSize + 1.
      return Math.floor(sitePosition / (defaultApiPageSize + 1)) + 1;
    }

    const maxPage = calculatePage(numSites);
    const sites: Site[][] = [];

    for (let response = 0; response < maxPage; response++) {
      sites.push([]);
    }

    for (let id = 1; id <= numSites; id++) {
      const site = new Site(generateSite({ id, ...overrides }));
      const page = calculatePage(id);
      site.addMetadata({ paging: { total: numSites, page, maxPage } });
      sites[page - 1].push(site);
    }
    return sites;
  }

  function generateMarkers(allSites: Site[][]) {
    const markers: google.maps.MarkerOptions[] = [];
    allSites.forEach((sites) =>
      markers.push(...sites.map((site) => site.getMapMarker()))
    );
    return markers;
  }

  function getMapMarkers() {
    return spec.query(mockMap).markers.toArray();
  }

  function interceptApiRequest(
    responses: Errorable<Site[]>[],
    expectations?: ((filter: Filters<ISite>, project: Project) => void)[],
    hasRegion?: boolean
  ): Promise<void>[] {
    return interceptRepeatApiRequests<ISite, Site[]>(
      hasRegion ? api.filterByRegion : api.filter,
      responses,
      expectations
    );
  }

  async function assertMapMarkers(promise: Promise<any>, allSites: Site[][]) {
    spec.detectChanges();
    await promise;
    spec.detectChanges();
    expect(getMapMarkers()).toEqual(generateMarkers(allSites));
  }

  it("should handle error", async () => {
    setup(defaultProject);
    const promise = Promise.all(interceptApiRequest([generateBawApiError()]));
    await assertMapMarkers(promise, []);
  });

  describe("markers", () => {
    beforeEach(() => {
      setup(defaultProject);
    });

    it("should display map placeholder box when no sites found", async () => {
      const promise = Promise.all(interceptApiRequest([[]]));
      await assertMapMarkers(promise, []);
    });

    it("should display map marker for single site", async () => {
      const sites = generatePagedSites(1);
      const promise = Promise.all(interceptApiRequest(sites));
      await assertMapMarkers(promise, sites);
    });

    it("should display map markers for multiple sites", async () => {
      const sites = generatePagedSites(25);
      const promise = Promise.all(interceptApiRequest(sites));
      await assertMapMarkers(promise, sites);
    });

    it("should request all pages if number of sites exceeds api page amount", async () => {
      const sites = generatePagedSites(26);
      const promise = Promise.all(interceptApiRequest(sites));
      await assertMapMarkers(promise, sites);
    });

    it("should display map markers for all sites over multiple pages", async () => {
      const sites = generatePagedSites(100);
      const promise = Promise.all(interceptApiRequest(sites));
      await assertMapMarkers(promise, sites);
    });

    it("should display map markers as requests return", async () => {
      const sites = generatePagedSites(100);
      const promises = interceptApiRequest(sites);

      await assertMapMarkers(promises[0], sites.slice(0, 1));
      await assertMapMarkers(promises[1], sites.slice(0, 2));
      await assertMapMarkers(promises[2], sites.slice(0, 3));
      await assertMapMarkers(promises[3], sites);
    });

    it("should sanitize map markers", async () => {
      const sites = generatePagedSites(100, {
        latitude: undefined,
        longitude: undefined,
        customLatitude: undefined,
        customLongitude: undefined,
      });
      const promise = Promise.all(interceptApiRequest(sites));
      await assertMapMarkers(promise, []);
    });
  });

  describe("api", () => {
    function assertFilter(page: number, project: Project, region?: Region) {
      return (filters: Filters<ISite>, _project: Project, _region?: Region) => {
        expect(filters).toEqual({ paging: { page } });
        expect(_project).toEqual(project);

        if (region) {
          expect(_region).toEqual(region);
        }
      };
    }

    it("should generate filter commands with initial filter", async () => {
      setup(defaultProject);

      const sites = generatePagedSites(1);
      const promise = Promise.all(
        interceptApiRequest(sites, [assertFilter(1, defaultProject)])
      );

      spec.detectChanges();
      await promise;
      spec.detectChanges();
    });

    it("should generate filter commands with incremental page numbers", async () => {
      setup(defaultProject);

      const sites = generatePagedSites(100);
      const promise = Promise.all(
        interceptApiRequest(
          sites,
          [1, 2, 3, 4].map((page) => assertFilter(page, defaultProject))
        )
      );

      spec.detectChanges();
      await promise;
      spec.detectChanges();
    });

    it("should generate filter commands with region id", async () => {
      setup(defaultProject, defaultRegion);

      const sites = generatePagedSites(1);
      const promise = Promise.all(
        interceptApiRequest(
          sites,
          [assertFilter(1, defaultProject, defaultRegion)],
          true
        )
      );

      spec.detectChanges();
      await promise;
      spec.detectChanges();
    });
  });
});
