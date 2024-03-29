import { IdOr } from "@baw-api/api-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { API_ROOT } from "@services/config/config.tokens";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import {
  mockServiceImports,
  mockServiceProviders,
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";
import { SitesService } from "./sites.service";

type Model = Site;
type Params = [IdOr<Project>];
type Service = SitesService;

describe("SitesService", (): void => {
  const createModel = () => new Site(generateSite({ id: 10 }));
  const listUrl = "/projects/5/sites/";
  const showUrl = listUrl + "10";
  let service: SitesService;
  let apiRoot: string;
  let spec: SpectatorService<SitesService>;
  const createService = createServiceFactory({
    service: SitesService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
    service = spec.inject(SitesService);
    apiRoot = spec.inject(API_ROOT);
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Site,
    listUrl,
    listUrl + "filter",
    showUrl,
    createModel,
    10, // site
    5 // project
  );

  validateCustomApiFilter<Model, [...Params, IdOr<Region>], Service>(
    () => spec,
    Site,
    listUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 10 } } },
    undefined,
    5, // project
    10 // region
  );

  describe("downloadAnnotations", () => {
    const defaultTimezone = "UTC";

    function getUrl(timezone: string = defaultTimezone) {
      const url = new URL(
        `${apiRoot}${showUrl}/audio_events/download?selected_timezone_name=${timezone}`
      );
      return url.toString();
    }

    it("should return url using model ids", () => {
      expect(service.downloadAnnotations(10, 5, defaultTimezone)).toBe(
        getUrl()
      );
    });

    it("should return url using model objects", () => {
      expect(
        service.downloadAnnotations(
          new Site(generateSite({ id: 10 })),
          new Project(generateProject({ id: 5 })),
          defaultTimezone
        )
      ).toBe(getUrl());
    });

    it("should return url with timezone", () => {
      expect(service.downloadAnnotations(10, 5, "Brisbane")).toBe(
        getUrl("Brisbane")
      );
    });
  });
});
