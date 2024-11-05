import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { AssociationInjectorService } from "./association-injector.service";

describe("AssociationInjectorService", () => {
  let service: SpectatorService<AssociationInjectorService>;

  const createService = createServiceFactory({
    service: AssociationInjectorService,
  });

  beforeEach(() => {
    service = createService();
  });

  xit("should create", () => {
    expect(service).toBeInstanceOf(AssociationInjectorService);
  });
});
