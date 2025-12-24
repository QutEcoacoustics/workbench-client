// Anything exported from this file is intended to be used as a public API.
//
// Note at the moment, there is nothing exported from this file.
// Therefore the file is intended to be used as a module only for its
// custom-element and typing side-effects.

// The polyfills must be imported first to ensure that they are applied before
// any Angular components are registered.
import "../../../src/polyfills";

import { IConfiguration } from "@helpers/app-initializer/app-initializer";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";
import { registerWebComponents, WebComponentSelector } from "./register";

const webComponentMappings = new Map<WebComponentSelector, any>([
  ["oe-event-map", EventMapWebComponent],
]);

export interface WebComponentConfig extends IConfiguration {}

// By calling this function, the web components will be registered as a
// side-effect.
export function register(config?: WebComponentConfig): void {
  registerWebComponents(webComponentMappings, config);
}
