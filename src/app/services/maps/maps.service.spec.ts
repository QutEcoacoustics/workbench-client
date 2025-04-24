import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { testApiConfig } from "@services/config/configMock.service";
import { destroyGoogleMaps } from "@test/helpers/googleMaps";
import { provideMockConfig } from "@services/config/provide-ConfigMock";
import { GoogleMapsState, MapsService } from "./maps.service";

describe("MapsService", () => {
  let spec: SpectatorService<MapsService>;

  const createService = createServiceFactory({
    service: MapsService,
    providers: [provideMockConfig()],
  });

  function scriptUrl(): string {
    return spec.service["googleMapsBundleUrl"]();
  }

  function triggerLoadSuccess(): void {
    spec.service.mapsState = GoogleMapsState.Loaded;
    spec.service.loadAsync = async () => true;
  }

  function triggerLoadFailure(): void {
    spec.service.mapsState = GoogleMapsState.Failed;
    spec.service.loadAsync = async () => false;
  }

  beforeEach(() => {
    spec = createService();
  });

  afterEach(() => {
    destroyGoogleMaps();
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

  it("should resolve all promises with 'true' when google maps is successfully embedded", (done) => {
    triggerLoadSuccess();

    spec.service.loadAsync().then((success: boolean) => {
      expect(success).toBeTrue();
      done();
    });
  });

  it("should result all promises with 'false' when google maps fails to embed", (done) => {
    triggerLoadFailure();

    spec.service.loadAsync().then((success: boolean) => {
      expect(success).toBeFalse();
      done();
    });
  });

  it("should immediately resolve a 'loadAsync' with 'true' after google maps has been embedded", (done) => {
    triggerLoadSuccess();

    spec.service.loadAsync().then(async () => {
      const success = await spec.service.loadAsync();
      expect(success).toBeTrue();
      done();
    });
  });

  it("should immediately resolve a 'loadAsync' with 'false' after google maps failed to embed", (done) => {
    triggerLoadFailure();

    spec.service.loadAsync().then(async () => {
      const success = await spec.service.loadAsync();
      expect(success).toBeFalse();
      done();
    });
  });
});
