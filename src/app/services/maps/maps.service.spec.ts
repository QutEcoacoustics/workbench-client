import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MockConfigModule } from "@services/config/configMock.module";
import { testApiConfig } from "@services/config/configMock.service";
import { destroyGoogleMaps } from "@test/helpers/googleMaps";
import { MapsService } from "./maps.service";

describe("MapsService", () => {
  let spec: SpectatorService<MapsService>;

  const createService = createServiceFactory({
    service: MapsService,
    imports: [MockConfigModule],
  });

  function scriptUrl(): string {
    return spec.service["googleMapsBundleUrl"]();
  }

  function triggerLoadSuccess(): void {
    spec.service["handleGoogleMapsLoaded"]();
  }

  function triggerLoadFailure(): void {
    spec.service["handleGoogleMapsFailed"]();
  }

  beforeEach(() => {
    spec = createService();
  });

  afterEach(() => {
    destroyGoogleMaps();
    MapsService["embeddedService"] = false;
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(MapsService);
  });

  it("should add the auth key to the google maps script", () => {
    const expectedApiKey = testApiConfig.keys.googleMaps;
    const expectedUrl = `https://maps.googleapis.com/maps/api/js?loading=async&key=${expectedApiKey}`;
    const realizedUrl = scriptUrl();

    expect(realizedUrl).toEqual(expectedUrl);
  });

  it("should resolve all promises when google maps is successfully embedded", (done) => {
    spec.service
      .loadAsync()
      .catch(() => fail("Promise should have resolved"))
      .finally(() => done());

    triggerLoadSuccess();
  });

  it("should reject all promises when google maps fails to embed", (done) => {
    spec.service
      .loadAsync()
      .then(() => fail("Promise should have rejected"))
      .finally(() => done());

    triggerLoadFailure();
  });

  it("should immediately resolve a 'loadAsync' after google maps has been embedded", (done) => {
    spec.service
      .loadAsync()
      .then(async () => {
        // because this await does not have a catch clause, causing this test to
        // fail if the promise is rejected
        await spec.service.loadAsync();
        done();
      })
      .catch(() => {
        fail("Promise should have resolved");
        done();
      });

    triggerLoadSuccess();
  });

  it("should immediately reject a 'loadAsync' after google maps failed to embed", (done) => {
    spec.service
      .loadAsync()
      .then(() => fail("Promise should have rejected"))
      .catch(() => {
        spec.service
          .loadAsync()
          .then(() => fail("Promise should have rejected"))
          .catch(() => done());
      });

    triggerLoadFailure();
  });
});
