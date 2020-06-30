import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from "@angular/common/http/testing";
import { SecurityService } from "@baw-api/security/security.service";
import { SessionUser } from "@models/User";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { AppConfigService } from "@services/app-config/app-config.service";
import { testApiConfig } from "@services/app-config/appConfigMock.service";
import { generateSessionUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { HttpClientOpts, testBawServices } from "@test/helpers/testbed";
import { SecuredImageDirective } from "./secured-image.directive";

describe("SecuredImageDirective", () => {
  let spectator: SpectatorDirective<SecuredImageDirective>;
  let httpMock: HttpTestingController;
  const createDirective = createDirectiveFactory({
    directive: SecuredImageDirective,
    imports: [HttpClientTestingModule],
    providers: testBawServices,
    detectChanges: false,
  });

  function interceptHttpRequest(
    src: string,
    body: Blob,
    opts?: HttpClientOpts
  ): TestRequest {
    const req = httpMock.expectOne(src);
    req.flush(body, opts);
    return req;
  }

  function assertSrc() {
    expect(spectator.element).toHaveAttribute("src");
    expect((spectator.element as HTMLImageElement).src).toContain(
      `blob:http://${window.location.host}/`
    );
  }

  afterEach(() => {
    httpMock.verify();
  });

  describe("local resources", () => {
    let assetsRoot: string;
    let config: AppConfigService;

    beforeEach(() => {
      // ! Override config assets root
      assetsRoot = testApiConfig.environment.assetRoot;
      testApiConfig.environment.assetRoot = "/testing_assets";

      spectator = createDirective(`<img bawImage src="/test.png" />`);
      httpMock = spectator.inject(HttpTestingController);
      config = spectator.inject(AppConfigService);
      spectator.detectChanges();
    });

    afterEach(() => {
      // ! Re-write config assets root
      testApiConfig.environment.assetRoot = assetsRoot;
    });

    it("should prepend app config assets root to path", () => {
      const blob = new Blob([modelData.image.dataUri()]);
      interceptHttpRequest("/testing_assets/test.png", blob);
      assertSrc();
    });
  });

  describe("api resources", () => {
    let securityService: SecurityService;

    beforeEach(() => {
      spectator = createDirective(
        `<img bawImage src="${testApiConfig.environment.apiRoot}/test.png" />`
      );
      httpMock = spectator.inject(HttpTestingController);
      securityService = spectator.inject(SecurityService);
    });

    it("should not modify path", () => {
      spectator.detectChanges();

      const blob = new Blob([modelData.image.dataUri()]);
      interceptHttpRequest(
        `${testApiConfig.environment.apiRoot}/test.png`,
        blob
      );
      assertSrc();
    });

    it("should not apply api headers to request", () => {
      spectator.detectChanges();

      const blob = new Blob([modelData.image.dataUri()]);
      const req = interceptHttpRequest(
        `${testApiConfig.environment.apiRoot}/test.png`,
        blob
      );

      expect(req.request.headers.has("Accept")).toBeFalsy();
      expect(req.request.headers.has("Content-Type")).toBeFalsy();
    });

    it("should apply authorization token to request", () => {
      spyOn(securityService, "isLoggedIn").and.callFake(() => true);
      spyOn(securityService, "getLocalUser").and.callFake(
        () => new SessionUser(generateSessionUser())
      );
      spectator.detectChanges();

      const blob = new Blob([modelData.image.dataUri()]);
      const req = interceptHttpRequest(
        `${testApiConfig.environment.apiRoot}/test.png`,
        blob
      );

      expect(req.request.headers.has("Authorization")).toBeTruthy();
    });
  });

  describe("external resources", () => {
    beforeEach(() => {
      spectator = createDirective(
        `<img bawImage src="https://broken_link/test.png" />`
      );
      httpMock = spectator.inject(HttpTestingController);
      spectator.detectChanges();
    });

    it("should not modify path", () => {
      const blob = new Blob([modelData.image.dataUri()]);
      interceptHttpRequest("https://broken_link/test.png", blob);
      assertSrc();
    });
  });
});
