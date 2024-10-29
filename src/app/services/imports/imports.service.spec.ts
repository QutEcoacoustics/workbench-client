import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ImportsService } from "./imports.service";

describe("ImportsService", () => {
  let service: SpectatorService<ImportsService>;

  const createService = createServiceFactory({
    service: ImportsService,
  });

  beforeEach(() => {
    service = createService();
  });

  it("should create", () => {
    expect(service).toBeInstanceOf(ImportsService);
  });
});
