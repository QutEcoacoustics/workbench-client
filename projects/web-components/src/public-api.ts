import { APP_ID } from "@angular/core";
import { createCustomElement, NgElement, WithProperties } from "@angular/elements";
import { GoogleMap, MapAdvancedMarker, MapInfoWindow, MapMarkerClusterer } from "@angular/google-maps";
import { createApplication } from "@angular/platform-browser";
// import { Id } from "@interfaces/apiInterfaces";
// import { AudioEventGroup } from "@models/AudioEventGroup";
// import { Site } from "@models/Site";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";

const webComponentMappings = new Map<string, any>([
  ["baw-event-map", EventMapWebComponent],
]);

(async () => {
  const app = await createApplication({
    providers: [
      // event-map.component dependencies
      // MapComponent,

      // map.component dependencies
      GoogleMap,
      MapAdvancedMarker,
      MapMarkerClusterer,
      MapInfoWindow,
      // LoadingComponent,
      // NgTemplateOutlet,

      // provideConfig(),
      // provideBawApi(),

      { provide: APP_ID, useValue: "workbench-client" },
    ],
  });

  for (const [selector, component] of webComponentMappings) {
    const customElementComponent = createCustomElement(component, app);
    customElements.define(selector, customElementComponent);
  }
})();

declare global {
  interface HTMLElementTagNameMap {
    'baw-event-map': NgElement & WithProperties<{
      // siteFocused: Id<Site>;
      // events: any[];
      events: any[];
      siteFocused: number;
    }>;
  }
}
