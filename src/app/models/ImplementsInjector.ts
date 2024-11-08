import { Injector } from "@angular/core";
import { Brand } from "@helpers/advancedTypes";
import { AbstractModel } from "./AbstractModel";

export type AssociationInjector = Brand<Injector, "AssociationInjector">;
export type ImplementsAssociations = AbstractModel | HasAssociationInjector;

/**
 * Allows a class to use association directives
 */
export interface HasAssociationInjector {
  injector?: AssociationInjector;
}
