import { IdOr } from "@baw-api/api-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { generateRegion } from "@test/fakes/Region";
import {
  mockServiceProviders,
  validateStandardApi,
} from "@test/helpers/api-common";
import { API_ROOT } from "@services/config/config.tokens";
import { generateProject } from "@test/fakes/Project";
import { modelData } from "@test/helpers/faker";
import { RegionsService } from "./regions.service";

type Model = Region;
type Params = [IdOr<Project>];
type Service = RegionsService;

describe("RegionsService", (): void => {
  const mockRegionId = modelData.id();
  const mockProjectId = modelData.id();
  const createModel = () => new Region(generateRegion({ id: mockRegionId }));

  const baseUrl = `/projects/${mockProjectId}/regions/`;
  const updateUrl: string = baseUrl + mockRegionId;
  let apiRoot: string;

  let spec: SpectatorService<RegionsService>;

  const createService = createServiceFactory({
    service: RegionsService,
    providers: mockServiceProviders,
  });

  beforeEach((): void => {
    spec = createService();
    apiRoot = spec.inject(API_ROOT);
  });

  validateStandardApi<Model, Params, Service>(
    () => spec,
    Region,
    baseUrl,
    baseUrl + "filter",
    updateUrl,
    createModel,
    mockRegionId,
    mockProjectId,
  );

  describe("downloadAnnotations", () => {
    const defaultTimezone = "UTC";

    function getUrl(timezone = defaultTimezone) {
      const url = new URL(
        `${apiRoot}/projects/${mockProjectId}/regions/${mockRegionId}/audio_events/download?selected_timezone_name=${timezone}`
      );
      return url.toString();
    }

    it("should return url using model ids", () => {
      const expectedUrl = getUrl();
      const realizedUrl = spec.service.downloadAnnotations(
        mockRegionId,
        mockProjectId,
        defaultTimezone
      );

      expect(realizedUrl).toEqual(expectedUrl);
    });

    it("should return url using model objects", () => {
      const expectedUrl = getUrl();
      const realizedUrl = spec.service.downloadAnnotations(
        new Region(generateRegion({ id: mockRegionId })),
        new Project(generateProject({ id: mockProjectId })),
        defaultTimezone
      )

      expect(realizedUrl).toBe(expectedUrl);
    });

    it("should return url with timezone", () => {
      const expectedUrl = getUrl("Brisbane");
      const realizedUrl = spec.service.downloadAnnotations(mockRegionId, mockProjectId, "Brisbane");

      expect(realizedUrl).toEqual(expectedUrl);
    });

  });
});
