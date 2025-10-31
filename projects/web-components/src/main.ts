import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { EventMapWebComponent } from "./app/components/event-map/event-map.web.component";

(async () => {
  const app = await createApplication({
    providers: [],
  });

  const eventMapWebComponent = createCustomElement(EventMapWebComponent, {
    injector: app.injector,
  });

  customElements.define("oe-baw-event-map", eventMapWebComponent);
})();
