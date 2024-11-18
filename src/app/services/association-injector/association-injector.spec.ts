import { BAW_SERVICE_OPTIONS } from "@baw-api/api-common";
import { ACCOUNT } from "@baw-api/ServiceTokens";
import { GlobalsService } from "@services/globals/globals.service";
import { TestBed } from "@angular/core/testing";
import { AssociationInjector } from "@models/ImplementsInjector";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastrService } from "ngx-toastr";
import { mockProvider } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "./association-injector.tokens";
import { associationInjectorProvider } from "./association-injector.factory";

describe("AssociationInjectorService", () => {
  let injector: AssociationInjector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockBawApiModule],
      providers: [associationInjectorProvider, mockProvider(ToastrService)],
    });

    injector = TestBed.inject(ASSOCIATION_INJECTOR);
  });

  it("should have the service options injected with the correct options", () => {
    const bawServiceOptions = injector.get(BAW_SERVICE_OPTIONS);
    expect(bawServiceOptions).toEqual({ disableNotification: true });
  });

  it("should provide baw-api services through the association injector", () => {
    const service = injector.get(ACCOUNT.token);
    expect(service).toBeProvidedBy(injector);
  });

  it("should use the root injector for services that don't contact the baw-api", () => {
    const service = injector.get(GlobalsService);
    expect(service).not.toBeProvidedBy(injector);
  });
});