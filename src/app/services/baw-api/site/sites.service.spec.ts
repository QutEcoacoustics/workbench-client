import { HttpClientTestingModule } from "@angular/common/http/testing";
import { IdOr, setAuthorizationQSP, setTimezoneQSP } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SessionUser } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateSessionUser } from "@test/fakes/User";
import {
  validateApiCreateMultipart,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { SitesService } from "./sites.service";

type Model = Site;
type Params = [IdOr<Project>];
type Service = SitesService;

describe("SitesService", function () {
  const createModel = () => new Site(generateSite({ id: 10 }));
  const listUrl = "/projects/5/sites/";
  const showUrl = "/projects/5/sites/10";
  let service: SitesService;
  let apiRoot: string;
  let spec: SpectatorService<SitesService>;
  const createService = createServiceFactory({
    service: SitesService,
    imports: [HttpClientTestingModule, MockAppConfigModule],
  });

  beforeEach(function () {
    spec = createService();
    this.service = spec.service;
    service = spec.inject(SitesService);
    apiRoot = spec.inject(API_ROOT);
  });

  validateApiList<Model, Params, Service>(listUrl, 5);
  validateApiFilter<Model, Params, Service>(listUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(showUrl, 10, createModel, 5);
  validateApiCreateMultipart<Model, Params, Service>(listUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(showUrl, createModel, 5);
  validateApiDestroy<Model, Params, Service>(showUrl, 10, createModel, 5);

  validateCustomApiFilter<Model, [...Params, IdOr<Region>], Service>(
    listUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 10 } } },
    undefined,
    5,
    10
  );

  describe("downloadAnnotations", () => {
    const defaultTimezone = "UTC";

    function setLoggedIn(authToken: string) {
      if (!authToken) {
        spyOn(service, "getLocalUser").and.callFake(() => null);
      } else {
        const user = new SessionUser(generateSessionUser({ authToken }));
        spyOn(service, "getLocalUser").and.callFake(() => user);
      }
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
