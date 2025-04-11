import { Injector, Provider } from "@angular/core";
import { AssociationInjector } from "@models/ImplementsInjector";
import { BAW_SERVICE_OPTIONS } from "../baw-api/api-common";
import { BawApiService, BawServiceOptions } from "../baw-api/baw-api.service";
import {
  services,
  serviceTokens,
  serviceResolvers,
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

  // cast associationInjector so that we return the correct branded type
  // warning: using "as" here disables type-checking for this line. Make sure
  // that you have correctly type-checked the association injector before this
  // type cast
  return associationInjector as AssociationInjector;
}
