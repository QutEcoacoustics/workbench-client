import { Injector, Provider } from "@angular/core";
import { withBrand } from "@helpers/advancedTypes";
import { AssociationInjector } from "@models/ImplementsInjector";
import { BAW_SERVICE_OPTIONS } from "../baw-api/api-common";
import { BawApiService, BawServiceOptions } from "../baw-api/baw-api.service";
import {
  serviceResolvers,
  services,
  serviceTokens,
} from "../baw-api/ServiceProviders";
import { ASSOCIATION_INJECTOR } from "./association-injector.tokens";

//! WARNING: to minimize the risk of a circular dependency
// providing an association injector should always be imported through the
// following provider and consumed through the ASSOCIATION_INJECTOR token
export const associationInjectorProvider: Provider = {
  provide: ASSOCIATION_INJECTOR,
  useFactory: associationInjectorFactory,
  deps: [Injector],
};

export const associationApiOptions = Object.freeze({
  disableNotification: true,
}) satisfies BawServiceOptions;

function associationInjectorFactory(
  parentInjector: Injector
): AssociationInjector {
  // I assign associationInjector to a variable first so that TypeScript will
  // type-check the Injector before we disable type-checking in the brand cast
  const associationInjector = Injector.create({
    name: "AssociationInjector",
    parent: parentInjector,
    providers: [
      { provide: BawApiService, useClass: BawApiService },
      { provide: BAW_SERVICE_OPTIONS, useValue: associationApiOptions },
      ...services,
      ...serviceTokens,
      ...serviceResolvers,
    ],
  });

  return withBrand<AssociationInjector>(associationInjector);
}
