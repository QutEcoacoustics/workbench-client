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
});
