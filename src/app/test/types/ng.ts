/* eslint-disable @typescript-eslint/ban-types */
import {
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Injector,
} from "@angular/core";

// TODO Replace this entire type file with a version from angular instead of
// maintaining ourselves

// https://angular.io/api/core/global/ComponentDebugMetadata
interface ComponentDebugMetadata extends DirectiveDebugMetadata {
  encapsulation: ViewEncapsulation;
  changeDetection: ChangeDetectionStrategy;

  // inherited from core/global/DirectiveDebugMetadata
  inputs: Record<string, string>;
  outputs: Record<string, string>;
}

// https://angular.io/api/core/global/DirectiveDebugMetadata
interface DirectiveDebugMetadata {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
}

// https://angular.io/api/core/global/Listener
interface Listener {
  name: string;
  element: Element;
  callback: (value: any) => any;
  useCapture: boolean;
  type: "dom" | "output";
}

// https://angular.io/api/core/global
export interface Ng {
  applyChanges: (component: {}) => void;
  getComponent: <T>(element: Element) => T | null;
  getContext: <T>(element: Element) => T | null;
  getDirectiveMetadata: (
    directiveOrComponentInstance: any
  ) => ComponentDebugMetadata | DirectiveDebugMetadata | null;
  getDirectives: (node: Node) => {}[];
  getHostElement: (componentOrDirective: {}) => Element;
  getInjector: (elementOrDir: {} | Element) => Injector;
  getListeners: (element: Element) => Listener[];
  getOwningComponent: <T>(elementOrDir: {} | Element) => T | null;
  getRootComponents: (elementOrDir: {} | Element) => {}[];
}
