import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { Injector } from "@angular/core";
import { BAW_SERVICE_OPTIONS } from "@baw-api/api-common";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastrService } from "ngx-toastr";
import { GlobalsService } from "@services/globals/globals.service";
import { AssociationInjectorService } from "./association-injector.service";

describe("AssociationInjectorService", () => {
  let spectator: SpectatorService<AssociationInjectorService>;

  const createService = createServiceFactory({
    service: AssociationInjectorService,
    imports: [MockBawApiModule],
    mocks: [ToastrService],
  });

  async function associationInjector(): Promise<Injector> {
    return await spectator.service.createInstance();
  }

  beforeEach(() => {
    spectator = createService();
  });

  it("should create", () => {
    expect(spectator.service).toBeInstanceOf(AssociationInjectorService);
  });

  it("should have the service options injected with the correct options", async () => {
    const injector = await associationInjector();
    const bawServiceOptions = injector.get(BAW_SERVICE_OPTIONS);
    expect(bawServiceOptions).toEqual({ disableNotification: true });
  });

  it("should provide baw-api services through the association injector", async () => {
    const injector = await associationInjector();
    const service = injector.get(ACCOUNT.token);
    expect(service).toBeProvidedBy(injector);
  });

  it("should use the root injector for services that don't contact the baw-api", async () => {
    const injector = await associationInjector();
    const service = injector.get(GlobalsService);
    expect(service).not.toBeProvidedBy(injector);
  });
});
