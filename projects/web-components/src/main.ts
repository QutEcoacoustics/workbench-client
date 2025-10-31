import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { provideConfig } from "@services/config/provide-config";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { EventMapWebComponent } from "./app/components/event-map/event-map.web.component";

(async () => {
  const app = await createApplication({
    providers: [provideConfig(), provideBawApi()],
  });

  const eventMapWebComponent = createCustomElement(EventMapWebComponent, {
    injector: app.injector,
  });

  customElements.define("oe-baw-event-map", eventMapWebComponent);
})();
