import { APP_ID } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { Configuration } from "@helpers/app-initializer/app-initializer";
import { API_CONFIG } from "@services/config/config.tokens";
import { provideConfig } from "@services/config/provide-config";
import { IS_WEB_COMPONENT_TARGET } from "src/app/app.helper";
import { applyMonkeyPatches } from "src/patches/patches";
import { defaultConfig } from "./defaultConfig";

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
 * We use to `oe-` prefix here instead of the `baw-` prefix used by the
 * workbench to avoid potential conflicts with internal workbench selectors.
 *
 * @example
 * ```typescript
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
  configNamespace: string,
): Promise<void> {
  // We inject web component styles before registering any web components so
  // that the styles are available when the components are initially created to
  // minimize the risk of FOUC (Flash of Unstyled Content).
  await injectStyles();
  applyMonkeyPatches();

  const app = await createApplication({
    providers: [
      provideConfig(),
      provideBawApi(),

      { provide: APP_ID, useValue: "baw-web-components" },
      { provide: API_CONFIG, useFactory: configFactory(configNamespace) },
      { provide: IS_WEB_COMPONENT_TARGET, useValue: true },
    ],
  });

  for (const [selector, component] of mappings) {
    const customElementComponent = createCustomElement(component, app);
    customElements.define(selector, customElementComponent);
  }
}

/**
 * @description
 * Imports and injects the global styles for the workbench client's web
 * components.
 *
 * This is automatically called during the web component registration process
 * so that the styles are applied before any components are instantiated and
 * so that using these web components only requires a single import (instead of
 * also needing to import styles separately).
 */
async function injectStyles(): Promise<void> {
  const stylesUrl = new URL("styles.css", import.meta.url);

  const styleFile = await fetch(stylesUrl.href);
  const styleContent = await styleFile.text();

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styleContent);

  document.adoptedStyleSheets?.push(styleSheet);
}

/**
 * @description
 * A DI provider factory that returns the application {@linkcode Configuration}
 * object.
 * This factory differs from the standard workbench provider as it allows for
 * `window`-level overrides.
 */
function configFactory(configNamespace: string): () => Configuration {
  return () => {
    const windowLevelConfig = window[configNamespace];
    if (windowLevelConfig) {
      return new Configuration(windowLevelConfig);
    }

    return new Configuration(defaultConfig);
  };
}
