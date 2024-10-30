import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ImportsService } from "./import.service";

describe("ImportsService", () => {
  let spectator: SpectatorService<ImportsService>;

  const createService = createServiceFactory({
    service: ImportsService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it("should create", () => {
    expect(spectator.service).toBeInstanceOf(ImportsService);
  });
});
