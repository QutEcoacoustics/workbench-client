// Anything exported from this file is intended to be used as a public API.
//
// Note at the moment, there is nothing exported from this file.
// Therefore the file is intended to be used as a module only for its
// custom-element and typing side-effects.

// The polyfills must be imported first to ensure that they are applied before
// any Angular components are registered..
import "../../../src/polyfills";

import { IConfiguration } from "@helpers/app-initializer/app-initializer";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";
import { registerWebComponents, WebComponentSelector } from "./register";

const bawConfigName = "__baw_config__";
const webComponentMappings = new Map<WebComponentSelector, any>([
  ["oe-event-map", EventMapWebComponent],
]);

// By calling this function, the web components will be registered as a
// side-effect.
registerWebComponents(webComponentMappings, bawConfigName);

// Patch the global namespace to include the custom baw config property.
// We do this so that TypeScript users do not get type errors when trying to
// set the configuration at the window level.
declare global {
  interface Window {
    /**
     * @description
     * Provide a baw configuration object at the window level to override the
     * default configuration.
     *
     * @example
     * ```html
     * <script type="module">
     * window.__baw_config__ = {
     *   apiUrl: "https://api.example.com",
     *   googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
     * };
     * </script>
     * ```
     */
    [bawConfigName]: IConfiguration;
  }
}
