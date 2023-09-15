import { Injector } from "@angular/core";

/**
 * Allows a class to use association directives
 */
export interface ImplementsInjector {
  injector?: Injector;
}
