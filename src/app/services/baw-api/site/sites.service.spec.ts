import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr, setAuthorizationQSP, setTimezoneQSP } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import {
  validateCustomApiFilter,
  validateStandardApi,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { ToastrService } from "ngx-toastr";
import { SitesService } from "./sites.service";

type Model = Site;
type Params = [IdOr<Project>];
type Service = SitesService;

describe("SitesService", (): void => {
  const createModel = () => new Site(generateSite({ id: 10 }));
  const listUrl = "/projects/5/sites/";
  const showUrl = "/projects/5/sites/10";
  let service: SitesService;
  let apiRoot: string;
  let session: BawSessionService;
  let spec: SpectatorService<SitesService>;
  const createService = createServiceFactory({
    service: SitesService,
    imports: [MockAppConfigModule, HttpClientTestingModule],
    providers: [BawApiService, BawSessionService, mockProvider(ToastrService)],
  });

  beforeEach((): void => {
    spec = createService();
    service = spec.inject(SitesService);
    apiRoot = spec.inject(API_ROOT);
    session = spec.inject(BawSessionService);
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

    function setLoggedIn(authToken: string) {
      spyOnProperty(session, "authToken").and.returnValue(authToken);
    }

    function getUrl(timezone: string = defaultTimezone, token?: string) {
      const url = new URL(`${apiRoot}${showUrl}/audio_events/download`);
      setTimezoneQSP(url, timezone);
      setAuthorizationQSP(url, token);
      return url.toString();
    }

    it("should return url using model ids", () => {
      setLoggedIn(null);
      expect(service.downloadAnnotations(10, 5, defaultTimezone)).toBe(
        getUrl()
      );
    });

    it("should return url using model objects", () => {
      setLoggedIn(null);
      expect(
        service.downloadAnnotations(
          new Site(generateSite({ id: 10 })),
          new Project(generateProject({ id: 5 })),
          defaultTimezone
        )
      ).toBe(getUrl());
    });

    it("should return url with auth token appended", () => {
      const authToken = modelData.authToken();
      setLoggedIn(authToken);
      expect(service.downloadAnnotations(10, 5, defaultTimezone)).toBe(
        getUrl(defaultTimezone, authToken)
      );
    });

    it("should return url with timezone", () => {
      setLoggedIn(null);
      expect(service.downloadAnnotations(10, 5, "Brisbane")).toBe(
        getUrl("Brisbane")
      );
    });
  });
});
