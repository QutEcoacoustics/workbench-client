import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AudioEventImportService } from "./audio-event-import.service";

describe("AudioEventImportService", () => {
  let spectator: SpectatorService<AudioEventImportService>;

  const createService = createServiceFactory({
    service: AudioEventImportService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it("should create", () => {
    expect(spectator.service).toBeInstanceOf(AudioEventImportService);
  });
});

