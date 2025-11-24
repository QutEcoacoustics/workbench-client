import { Injector, Provider } from "@angular/core";
import { AssociationInjector } from "@models/ImplementsInjector";
import { BAW_SERVICE_OPTIONS } from "@baw-api/api-common";
import { mockProviders } from "@baw-api/provide-baw-ApiMock";
import { withBrand } from "@helpers/advancedTypes";
import { ASSOCIATION_INJECTOR } from "./association-injector.tokens";
import { associationApiOptions } from "./association-injector.factory";

/**
 * An association injector that mocks api providers
 * This provider should only be used in testing
 */
export const mockAssociationInjector: Provider = {
  provide: ASSOCIATION_INJECTOR,
  useFactory: mockAssociationInjectorFactory,
  deps: [Injector],
};

export function mockAssociationInjectorFactory(
  parentInjector: Injector
): AssociationInjector {
  const associationInjector = Injector.create({
    name: "AssociationInjector",
    parent: parentInjector,
    providers: [
      { provide: BAW_SERVICE_OPTIONS, useValue: associationApiOptions },
      ...mockProviders,
    ],
  });

  return withBrand<AssociationInjector>(associationInjector);
}
