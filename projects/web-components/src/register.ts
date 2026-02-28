import { APP_ID } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { Configuration, IConfiguration } from "@helpers/app-initializer/app-initializer";
import { API_CONFIG } from "@services/config/config.tokens";
import { provideConfig } from "@services/config/provide-config";
import { IS_WEB_COMPONENT_TARGET } from "src/app/app.helper";
import { applyMonkeyPatches } from "src/patches/patches";
import { defaultConfig } from "./defaultConfig";
import { injectStyles } from "./dependencies";

/**
 * @description
 * A selector that can be used in a template to instantiate a web component.
 * This selector should adhere to the following rules:
 *   1. The selector MUST start with an "oe-" prefix.
 *   2. The selector MUST be all lowercase.
 *   3. The selector MUST only contain alphanumeric characters and hyphens.
 *   4. The selector MUST not conflict with any existing HTML or Angular
 *      elements.
 *
 * We use the `oe-` prefix here instead of the `baw-` prefix used by the
 * workbench to avoid potential conflicts with internal workbench selectors.
 *
 * @example
 * ```ts
 * const selector: WebComponentSelector = "oe-my-custom-element";
 * ```
 */
export type WebComponentSelector = `oe-${Lowercase<string>}`;

/**
 * @description
 * Registers the baw web components as custom elements.
 * This function will throw an error if any of the provided selectors are
 * already defined as custom elements.
 */
export async function registerWebComponents(
  mappings: Map<WebComponentSelector, any>,
  configObject: IConfiguration = defaultConfig,
): Promise<void> {
  // We inject web component styles before registering any web components so
  // that the styles are available when the components are initially created to
  // minimize the risk of FOUC (Flash of Unstyled Content).
  await injectStyles();
  applyMonkeyPatches();

  // Create a configuration instance from an object so that we don't have to
  // export the Configuration constructor.
  const config = new Configuration(configObject);

  const app = await createApplication({
    providers: [
      provideConfig(),
      provideBawApi(),

      { provide: APP_ID, useValue: "baw-web-components" },
      { provide: API_CONFIG, useValue: config },
      { provide: IS_WEB_COMPONENT_TARGET, useValue: true },
    ],
  });

  for (const [selector, component] of mappings) {
    const customElementComponent = createCustomElement(component, app);
    customElements.define(selector, customElementComponent);
  }
}
