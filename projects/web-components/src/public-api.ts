import { NgTemplateOutlet } from "@angular/common";
import { APP_ID } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { GoogleMap, MapAdvancedMarker, MapInfoWindow, MapMarkerClusterer } from "@angular/google-maps";
import { createApplication } from "@angular/platform-browser";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { Configuration, IConfiguration } from "@helpers/app-initializer/app-initializer";
import { API_CONFIG } from "@services/config/config.tokens";
import { provideConfig } from "@services/config/provide-config";
import { LoadingComponent } from "@shared/loading/loading.component";
import { MapComponent } from "@shared/map/map.component";
import { applyMonkeyPatches } from "src/patches/patches";
import { defaultConfig } from "./defaultConfig";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";

const bawConfigName = "__baw_config__";
const webComponentMappings = new Map<string, any>([
  ["baw-event-map", EventMapWebComponent],
]);

// We bootstrap the application using an async IIFE because top-level await is
// not supported in all browsers/build environments yet.
(async () => {
  applyMonkeyPatches();

  const app = await createApplication({
    providers: [
      // event-map.component dependencies
      MapComponent,

      // map.component dependencies
      GoogleMap,
      MapAdvancedMarker,
      MapMarkerClusterer,
      MapInfoWindow,
      LoadingComponent,
      NgTemplateOutlet,

      provideConfig(),
      provideBawApi(),

      { provide: APP_ID, useValue: "workbench-client" },
      { provide: API_CONFIG, useFactory: configFactory },
    ],
  });

  for (const [selector, component] of webComponentMappings) {
    const customElementComponent = createCustomElement(component, app);
    customElements.define(selector, customElementComponent);
  }
})();

function configFactory(): Configuration {
  const windowLevelConfig = window[bawConfigName];
  if (windowLevelConfig) {
    return new Configuration(windowLevelConfig);
  }

  return new Configuration(defaultConfig);
}

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
