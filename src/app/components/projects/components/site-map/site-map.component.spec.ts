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
  let defaultProjects: Project[];
  let defaultRegions: Region[];
  let api: SpyObject<ShallowSitesService>;
  let spec: Spectator<SiteMapComponent>;
  let injector: AssociationInjector;

  const createComponent = createComponentFactory({
    component: SiteMapComponent,
    imports: [MapComponent, MockModule(GoogleMapsModule)],
    providers: [provideMockBawApi()],
  });

  beforeEach(() => {
    defaultProjects = [new Project(generateProject())];
    defaultRegions = [new Region(generateRegion())];
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ShallowSitesService);
    injector = spec.inject(ASSOCIATION_INJECTOR);
  }

  function setComponentProps(
    projects?: Project[],
    regions?: Region[],
    sites?: Site[],
  ): void {
    spec.setInput({
      projects,
      regions,
      sites,
    });
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
    function assertFilter(projects: Project[], regions?: Region[]) {
      return (filters: Filters<Site>) => {
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

        expect(filters).toEqual(expectedFilters);
      };
    }

    it("should generate filter commands with initial filter", async () => {
      setup();

      const sites = generateSites(1);
      const promise = interceptApiRequest(sites);
      setComponentProps(defaultProjects);

      spec.detectChanges();
      await promise;
      spec.detectChanges();

      assertFilter(defaultProjects);
    });

    it("should only make one API request for multiple pages of items", async () => {
      setup();

      const sites = generateSites(100);
      const promise = interceptApiRequest(sites);
      setComponentProps(defaultProjects);

      spec.detectChanges();
      await promise;
      spec.detectChanges();

      assertFilter(defaultProjects);
    });

    it("should generate filter commands with region id", async () => {
      setup();

      const sites = generateSites(1);
      const promise = interceptApiRequest(sites);

      setComponentProps(defaultProjects, defaultRegions);

      spec.detectChanges();
      await promise;
      spec.detectChanges();

      assertFilter(defaultProjects, defaultRegions);
    });
  });
});
