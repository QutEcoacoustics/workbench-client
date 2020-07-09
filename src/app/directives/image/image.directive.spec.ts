import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SecurityService } from "@baw-api/security/security.service";
import { ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { SessionUser } from "@models/User";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { testApiConfig } from "@services/app-config/appConfigMock.service";
import { generateSessionUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { assertImage } from "@test/helpers/html";
import { testBawServices } from "@test/helpers/testbed";
import {
  AuthenticatedImageDirective,
  image404RelativeSrc,
} from "./image.directive";

describe("ImageDirective", () => {
  let spectator: SpectatorDirective<AuthenticatedImageDirective>;
  const image404Src = `http://${window.location.host}${image404RelativeSrc}`;
  const createDirective = createDirectiveFactory({
    directive: AuthenticatedImageDirective,
    imports: [HttpClientTestingModule],
    providers: testBawServices,
  });

  function getImage() {
    return spectator.query<HTMLImageElement>("img");
  }

  function createDefaultDirective(src: ImageUrl[]) {
    return createDirective(`<img alt="alt" [src]="src" />`, {
      hostProps: { src },
    });
  }

  it("should create", () => {
    spectator = createDefaultDirective(modelData.imageUrls());
    expect(getImage()).toBeTruthy();
  });

  describe("error handling", () => {
    function createImgErrorEvent(image: HTMLImageElement) {
      image.onerror("unit test");
      spectator.detectChanges();
    }

    it("should handle url error", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      createImgErrorEvent(image);
      assertImage(image, imageUrls[1].url, "alt");
    });

    it("should handle multiple url errors", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      [1, 2, 3].forEach(() => createImgErrorEvent(image));
      assertImage(image, imageUrls[3].url, "alt");
    });

    it("should handle running out of urls", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      imageUrls.forEach(() => createImgErrorEvent(image));
      assertImage(image, image404Src, "alt");
    });

    it("should handle empty list of urls", () => {
      spectator = createDefaultDirective([]);
      assertImage(getImage(), image404Src, "alt");
    });

    it("should handle undefined src", () => {
      spectator = createDefaultDirective(undefined);
      assertImage(getImage(), image404Src, "alt");
    });
  });

  describe("thumbnail", () => {
    function createThumbnailDirective(src: ImageUrl[], thumbnail: ImageSizes) {
      return createDirective(
        `<img alt="alt" [src]="src" [thumbnail]="thumbnail" />`,
        { hostProps: { src, thumbnail } }
      );
    }

    it("should use thumbnail url", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createThumbnailDirective(imageUrls, ImageSizes.MEDIUM);
      // MEDIUM image size is created at 2nd index by modelData.imageUrls
      assertImage(getImage(), imageUrls[2].url, "alt");
    });

    it("should handle missing thumbnail url", () => {
      const imageUrls = modelData.imageUrls();
      // DEFAULT image size is not set by modelData.imageUrls
      spectator = createThumbnailDirective(imageUrls, ImageSizes.DEFAULT);
      assertImage(getImage(), imageUrls[0].url, "alt");
    });
  });

  describe("internal links", () => {
    function getAssetRoot() {
      // Use test config instead of spectator.inject because this is used
      // before DI is initialized
      return testApiConfig.environment.assetRoot;
    }

    it("should prepend asset root path to url", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = "/image.png";
      spectator = createDefaultDirective(imageUrls);

      assertImage(
        getImage(),
        `http://${window.location.host}${getAssetRoot()}/image.png`,
        "alt"
      );
    });

    it("should not double prepend asset root path to url", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getAssetRoot() + "/image.png";
      spectator = createDefaultDirective(imageUrls);

      assertImage(
        getImage(),
        `http://${window.location.host}${getAssetRoot()}/image.png`,
        "alt"
      );
    });
  });

  describe("api links", () => {
    let api: SecurityService;

    function createApiDirective(src: ImageUrl[], disableAuth: boolean = false) {
      const spec = createDirective(
        `<img alt="alt" [src]="src" [disableAuth]="disableAuth" />`,
        {
          hostProps: { src, disableAuth },
          detectChanges: false,
        }
      );
      api = spec.inject(SecurityService);
      return spec;
    }

    function setLoggedIn(user: SessionUser) {
      spyOn(api, "isLoggedIn").and.callFake(() => true);
      spyOn(api, "getLocalUser").and.callFake(() => user);
    }

    function getApiRoot() {
      // Use test config instead of spectator.inject because this is used
      // before DI is initialized
      return testApiConfig.environment.apiRoot;
    }

    it("should append authToken", () => {
      const user = new SessionUser(generateSessionUser());
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls);
      setLoggedIn(user);
      spectator.detectChanges();

      assertImage(
        getImage(),
        `${getApiRoot()}/image.png?authToken=${user.authToken}`,
        "alt"
      );
    });

    it("should not double append authToken", () => {
      const user = new SessionUser(generateSessionUser());
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url =
        getApiRoot() + "/image.png?authToken=" + user.authToken;
      spectator = createApiDirective(imageUrls);
      setLoggedIn(user);
      spectator.detectChanges();

      assertImage(
        getImage(),
        `${getApiRoot()}/image.png?authToken=${user.authToken}`,
        "alt"
      );
    });

    it("should not append authToken if disableAuth set", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls, true);
      setLoggedIn(new SessionUser(generateSessionUser()));
      spectator.detectChanges();

      assertImage(getImage(), `${getApiRoot()}/image.png`, "alt");
    });

    it("should not append authToken if not logged in", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls);
      spectator.detectChanges();

      assertImage(getImage(), `${getApiRoot()}/image.png`, "alt");
    });

    it("should handle parameters in url", () => {
      const user = new SessionUser(generateSessionUser());
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png?testing=value";
      spectator = createApiDirective(imageUrls);
      setLoggedIn(user);
      spectator.detectChanges();

      assertImage(
        getImage(),
        `${getApiRoot()}/image.png?testing=value&authToken=${user.authToken}`,
        "alt"
      );
    });
  });

  describe("external links", () => {
    it("should not modify external link url", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      spectator = createDefaultDirective(imageUrls);
      assertImage(getImage(), imageUrls[0].url, "alt");
    });
  });
});
