import { IConfiguration } from "@helpers/app-initializer/app-initializer";
import { EventMapWebComponent } from "./lib/components/event-map/event-map.web.component";
import { registerWebComponents } from "./register";

const bawConfigName = "__baw_config__";
const webComponentMappings = new Map<string, any>([
  ["oe-event-map", EventMapWebComponent],
]);

registerWebComponents(webComponentMappings, bawConfigName);

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
