import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ImportAnnotationService } from "./import-annotation.service";

describe("ImportAnnotationService", () => {
  let spec: SpectatorService<ImportAnnotationService>;

  const createService = createServiceFactory({
    service: ImportAnnotationService,
  });

  beforeEach(() => {
    spec = createService();
  });

  it("should be created", () => {
    expect(spec.service).toBeInstanceOf(ImportAnnotationService);
  });
});
