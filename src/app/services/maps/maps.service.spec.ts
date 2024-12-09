import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { MapsService } from "./maps.service";

describe("MapsService", () => {
  let spec: SpectatorService<MapsService>;

  const createService = createServiceFactory({
    service: MapsService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(MapsService);
  });

  it("should not embed the google maps script if the service is already embedded", () => {});

  it("should embed the google maps script if the service is not already embedded", () => {});

  it("should add the auth key to the google maps script", () => {});

  it("should update the 'load' promise correctly when google maps loads", () => {});

  it("should update the 'load' promise correctly when google maps fails to load", () => {});

  it("should return a promise that immediate resolves if the maps are already loaded", () => {});

  it("should return a promise that immediate rejects if the maps have failed to load", () => {});
});
