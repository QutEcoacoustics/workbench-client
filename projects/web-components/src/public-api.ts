import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";
import { APP_ID } from "@angular/core";
import { GoogleMap, MapAdvancedMarker, MapInfoWindow, MapMarkerClusterer } from "@angular/google-maps";

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

  const eventMapWebComponent = createCustomElement(EventMapWebComponent, {
    injector: app.injector,
  });

  customElements.define("oe-baw-event-map", eventMapWebComponent);
})();
