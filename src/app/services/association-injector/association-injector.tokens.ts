import { InjectionToken } from "@angular/core";
import { AssociationInjector } from "@models/ImplementsInjector";

export const ASSOCIATION_INJECTOR = new InjectionToken<AssociationInjector>("baw.api.associationInjector");
