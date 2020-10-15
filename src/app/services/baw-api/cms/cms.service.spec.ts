import { SafeHtml } from "@angular/platform-browser";
import { SecurityService } from "@baw-api/security/security.service";
import { UserService } from "@baw-api/user/user.service";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { testApiConfig } from "@services/app-config/appConfigMock.service";
import { noop } from "rxjs";
import { CMS, CmsService } from "./cms.service";

export const cmsRoot = testApiConfig.environment.apiRoot + "/cms/";

describe("CmsService", () => {
  let api: SecurityService;
  let spectator: SpectatorHttp<CmsService>;
  const createService = createHttpFactory({
    service: CmsService,
    imports: [MockAppConfigModule],
    providers: [SecurityService, UserService],
  });
  const defaultUrl = CMS.HOME;

  function convertSafeHtmlToString(safeHtml: SafeHtml) {
    return safeHtml["changingThisBreaksApplicationSecurity"];
  }

  beforeEach(() => {
    spectator = createService();
    api = spectator.inject(SecurityService);
  });

  afterEach(() => spectator.controller.verify());

  it("should create get request", () => {
    spectator.service.get(defaultUrl).subscribe(noop, noop, noop);
    spectator.expectOne(defaultUrl, HttpMethod.GET);
  });

  it("should set responseType", () => {
    spectator.service.get(defaultUrl).subscribe(noop, noop, noop);
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    expect(req.request.responseType).toBe("text");
  });

  it("should return text response", (done) => {
    const response = "Testing";
    spectator.service.get(defaultUrl).subscribe((cms) => {
      expect(convertSafeHtmlToString(cms)).toBe(response);
      done();
    }, noop);
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });

  it("should return safeHtml", (done) => {
    const response = "<p>Testing</p>";
    spectator.service.get(defaultUrl).subscribe((cms) => {
      expect(cms["getTypeName"]()).toBe("HTML");
      done();
    }, noop);
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });

  it("should complete request", (done) => {
    const response = "Testing";
    spectator.service.get(defaultUrl).subscribe(noop, noop, () => {
      expect(true).toBeTruthy();
      done();
    });
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });
});
