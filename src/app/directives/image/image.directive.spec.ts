import { SimpleChange } from "@angular/core";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { BawSessionService } from "@baw-api/baw-session.service";
import { AuthToken, ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { testApiConfig } from "@services/config/configMock.service";
import { modelData } from "@test/helpers/faker";
import { websiteHttpUrl } from "@test/helpers/url";
import { AuthenticatedImageDirective, notFoundImage } from "./image.directive";

declare const ng: any;

describe("ImageDirective", () => {
  let spectator: SpectatorDirective<AuthenticatedImageDirective>;
  const image404Src = `${websiteHttpUrl}${notFoundImage.url}`;

  const createDirective = createDirectiveFactory({
    directive: AuthenticatedImageDirective,
    providers: [provideMockBawApi()],
  });

  function getImage() {
    return spectator.query<HTMLImageElement>("img");
  }

  function getDirective(image: HTMLImageElement): AuthenticatedImageDirective {
    return ng
      .getDirectives(image)
      .find((directive) => directive instanceof AuthenticatedImageDirective);
  }

  function createDefaultDirective(src: ImageUrl[]) {
    return createDirective('<img alt="alt" [src]="src" />', {
      hostProps: { src },
    });
  }

  function createDisabledDirective(src: string) {
    return createDirective(
      `<img alt="alt" src="${src}" [disableAuth]="true" />`
    );
  }

  function createImgErrorEvent(image: HTMLImageElement) {
    image.onerror?.("unit test");
    spectator.detectChanges();
  }

  it("should create", () => {
    spectator = createDefaultDirective(modelData.imageUrls());
    expect(getImage()).toBeTruthy();
  });

  it("should disable directive if disableAuth is set", () => {
    const src = modelData.imageUrl();
    spectator = createDisabledDirective(src);
    const image = getImage();
    expect(image).toHaveImage(src, { alt: "alt" }, { disableAuth: true });
    const directive = getDirective(image);
    directive["errorHandler"] = jasmine.createSpy().and.stub();
    createImgErrorEvent(image);
    expect(directive["errorHandler"]).not.toHaveBeenCalled();
  });

  describe("error handling", () => {
    it("given an invalid url, it loads the next available url", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      createImgErrorEvent(image);
      expect(image).toHaveImage(imageUrls[1].url);
    });

    it("given multiple bad urls, it ties to load each until one succeeds", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      [1, 2, 3].forEach(() => createImgErrorEvent(image));
      expect(image).toHaveImage(imageUrls[3].url);
    });

    it("given multiple bad urls, it loads default image last", () => {
      const imageUrls = modelData.imageUrls();
      imageUrls[0].size = ImageSizes.default;
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      imageUrls
        .slice(0, imageUrls.length - 1)
        .forEach(() => createImgErrorEvent(image));
      expect(image).toHaveImage(imageUrls[0].url);
    });

    it("given all bad urls, it loads 404 image", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(imageUrls);

      const image = getImage();
      imageUrls.forEach(() => createImgErrorEvent(image));
      expect(image).toHaveImage(image404Src);
    });

    it("given empty array of urls, it loads 404 image", () => {
      spectator = createDefaultDirective([]);
      expect(getImage()).toHaveImage(image404Src);
    });

    it("given undefined src, it loads 404 image", () => {
      spectator = createDefaultDirective(undefined);
      expect(getImage()).toHaveImage(image404Src);
    });

    it("given bad 404 image, it stops attempting to load images", () => {
      const imageUrls = [modelData.imageUrls()[0]];
      spectator = createDefaultDirective(imageUrls);
      const spy = spyOn<any>(
        spectator.directive,
        "setImageSrc"
      ).and.callThrough();

      const image = getImage();
      // Spam errors
      [1, 2, 3, 4].forEach(() => createImgErrorEvent(image));
      // Image url should have only been set once
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("internal links", () => {
    it("should not modify url", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = "/image.png";
      spectator = createDefaultDirective(imageUrls);
      expect(getImage()).toHaveImage(`${websiteHttpUrl}/image.png`);
    });
  });

  describe("api links", () => {
    let session: BawSessionService;

    function createApiDirective(
      src: ImageUrl[],
      ignoreAuthToken: boolean = false
    ) {
      const spec = createDirective(
        '<img alt="alt" [src]="src" [ignoreAuthToken]="ignoreAuthToken" />',
        {
          hostProps: { src, ignoreAuthToken },
          detectChanges: false,
        }
      );
      session = spec.inject(BawSessionService);
      return spec;
    }

    function setLoggedIn(authToken: AuthToken) {
      spyOnProperty(session, "isLoggedIn").and.callFake(() => !!authToken);
      spyOnProperty(session, "authToken").and.callFake(() => authToken);
    }

    function getApiRoot() {
      // Use test config instead of spectator.inject because this is used
      // before DI is initialized
      return testApiConfig.endpoints.apiRoot;
    }

    it("should append authToken to url", () => {
      const authToken = modelData.authToken();
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls);
      setLoggedIn(authToken);
      spectator.detectChanges();

      expect(getImage()).toHaveImage(
        `${getApiRoot()}/image.png?authToken=${authToken}`
      );
    });

    it("should not double append authToken to url", () => {
      const authToken = modelData.authToken();
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png?authToken=" + authToken;
      spectator = createApiDirective(imageUrls);
      setLoggedIn(authToken);
      spectator.detectChanges();

      expect(getImage()).toHaveImage(
        `${getApiRoot()}/image.png?authToken=${authToken}`
      );
    });

    it("should not append authToken to url if disableAuth set", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls, true);
      setLoggedIn(modelData.authToken());
      spectator.detectChanges();

      expect(getImage()).toHaveImage(`${getApiRoot()}/image.png`);
    });

    it("should not append authToken to url if not logged in", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png";
      spectator = createApiDirective(imageUrls);
      setLoggedIn(undefined);
      spectator.detectChanges();

      expect(getImage()).toHaveImage(`${getApiRoot()}/image.png`);
    });

    it("should handle additional parameters in url", () => {
      const authToken = modelData.authToken();
      const imageUrls = modelData.imageUrls().slice(0, 1);
      imageUrls[0].url = getApiRoot() + "/image.png?testing=value";
      spectator = createApiDirective(imageUrls);
      setLoggedIn(authToken);
      spectator.detectChanges();

      expect(getImage()).toHaveImage(
        `${getApiRoot()}/image.png?testing=value&authToken=${authToken}`
      );
    });
  });

  describe("external links", () => {
    it("should not modify external link url", () => {
      const imageUrls = modelData.imageUrls().slice(0, 1);
      spectator = createDefaultDirective(imageUrls);
      expect(getImage()).toHaveImage(imageUrls[0].url);
    });
  });

  describe("change detection", () => {
    function updateDirective(imageUrls: ImageUrl[]) {
      const change = new SimpleChange(undefined, imageUrls, false);
      (spectator.hostComponent as any).src = imageUrls;
      spectator.detectChanges();
      spectator.directive.ngOnChanges({ src: change });
    }

    it("should update with new images", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(undefined);

      const image = getImage();
      updateDirective(imageUrls);
      expect(image).toHaveImage(imageUrls[0].url);
    });

    it("should display 404 image after all urls attempted", () => {
      const imageUrls = modelData.imageUrls();
      spectator = createDefaultDirective(undefined);
      const image = getImage();

      imageUrls.forEach((imageUrl) => updateDirective([imageUrl]));
      imageUrls.forEach(() => createImgErrorEvent(image));
      expect(image).toHaveImage(image404Src);
    });
  });
});
