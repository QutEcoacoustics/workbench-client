import { SecurityService } from "@baw-api/security/security.service";
import { UserService } from "@baw-api/user/user.service";
import { createHttpFactory, HttpMethod, SpectatorHttp } from "@ngneat/spectator";
import { MockConfigModule } from "@services/config/configMock.module";
import { testApiConfig } from "@services/config/configMock.service";
import { assertOk } from "@test/helpers/general";
import { noop } from "rxjs";
import { CMS, CmsService } from "./cms.service";

export const cmsRoot = testApiConfig.endpoints.apiRoot + "/cms/";

describe("CmsService", () => {
  let spectator: SpectatorHttp<CmsService>;
  const createService = createHttpFactory({
    service: CmsService,
    imports: [MockConfigModule],
    providers: [SecurityService, UserService],
  });
  const defaultUrl = CMS.home;

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => spectator.controller.verify());

  it("should create get request", () => {
    spectator.service.get(defaultUrl).subscribe(noop);
    spectator.expectOne(defaultUrl, HttpMethod.GET);
  });

  it("should set responseType", () => {
    spectator.service.get(defaultUrl).subscribe(noop);
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    expect(req.request.responseType).toBe("text");
  });

  it("should return text response", (done) => {
    const response = "Testing";
    spectator.service.get(defaultUrl).subscribe((cms) => {
      expect(cms).toBe(response);
      done();
    });
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });

  it("should return html response", (done) => {
    const response = `
    <div>
      <style>p { color: #420; }</style>
      <p id='test'>Example HTML response from API</p>
      <script>document.getElementById('test').style.color = '#420';</script>
    </div>
    `;
    spectator.service.get(defaultUrl).subscribe((cms) => {
      expect(cms).toBe(response);
      done();
    });
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });

  it("should complete request", (done) => {
    const response = "Testing";
    spectator.service.get(defaultUrl).subscribe({
      complete: () => {
        assertOk();
        done();
      },
    });
    const req = spectator.expectOne(defaultUrl, HttpMethod.GET);
    req.flush(response);
  });
});
