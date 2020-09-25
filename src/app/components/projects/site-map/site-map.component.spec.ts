import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { MapComponent } from "@shared/map/map.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { SiteMapComponent } from "./site-map.component";

const MockMap = MockComponent(MapComponent);

describe("SiteMapComponent", () => {
  let api: SpyObject<SitesService>;
  let spectator: Spectator<SiteMapComponent>;
  const createComponent = createComponentFactory({
    component: SiteMapComponent,
    declarations: [MockMap],
    imports: [SharedModule, MockBawApiModule],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.setInput("project", new Project(generateProject()));
    api = spectator.inject(SitesService);
  });

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
      const site = new Site({ ...generateSite(id), ...overrides });
      const page = calculatePage(id);
      site.addMetadata({ paging: { total: numSites, page, maxPage } });
      sites[page - 1].push(site);
    }
    return sites;
  }

  function generateMarkers(allSites: Site[][]) {
    const markers: google.maps.ReadonlyMarkerOptions[] = [];
    allSites.forEach((sites) =>
      markers.push(...sites.map((site) => site.getMapMarker()))
    );
    return markers;
  }

  function getMapMarkers() {
    return spectator.query(MockMap).markers.toArray();
  }

  function interceptApiRequest(
    responses: (Site[] | ApiErrorDetails)[],
    expectations?: ((filter: Filters<ISite>, project: Project) => void)[]
  ): Promise<void>[] {
    const subjects: Subject<Site[]>[] = [];
    const promises: Promise<void>[] = [];

    responses.forEach((response) => {
      const subject = new Subject<Site[]>();
      subjects.push(subject);
      promises.push(
        nStepObservable(subject, () => response, !(response instanceof Array))
      );
    });

    let count = -1;
    api.filter.andCallFake((filters: Filters<ISite>, project: Project) => {
      count++;
      expectations?.[count]?.(filters, project);
      return subjects[count];
    });

    return promises;
  }

  async function assertMapMarkers(promise: Promise<any>, allSites: Site[][]) {
    spectator.detectChanges();
    await promise;
    spectator.detectChanges();
    expect(getMapMarkers()).toEqual(generateMarkers(allSites));
  }

  it("should handle error", async () => {
    const promise = Promise.all(
      interceptApiRequest([generateApiErrorDetails()])
    );
    await assertMapMarkers(promise, []);
  });

  describe("markers", () => {
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
    function assertFilter(page: number, project: Project) {
      return (filters: Filters<ISite>, model: Project) => {
        expect(filters).toEqual({ paging: { page } });
        expect(model).toEqual(project);
      };
    }

    it("should generate filter commands with initial filter", async () => {
      const sites = generatePagedSites(1);
      const promise = Promise.all(
        interceptApiRequest(sites, [
          assertFilter(1, spectator.component.project),
        ])
      );

      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
    });

    it("should generate filter commands with incremental page numbers", async () => {
      const sites = generatePagedSites(100);
      const promise = Promise.all(
        interceptApiRequest(sites, [
          assertFilter(1, spectator.component.project),
          assertFilter(2, spectator.component.project),
          assertFilter(3, spectator.component.project),
          assertFilter(4, spectator.component.project),
        ])
      );

      spectator.detectChanges();
      await promise;
      spectator.detectChanges();
    });
  });
});
