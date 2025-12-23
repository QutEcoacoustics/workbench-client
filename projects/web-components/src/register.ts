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

export async function registerWebComponents(
  mappings: Map<string, any>,
  configNamespace: string,
): Promise<void> {
  await injectStyles();
  applyMonkeyPatches();

  const app = await createApplication({
    providers: [
      provideConfig(),
      provideBawApi(),

      { provide: APP_ID, useValue: "workbench-client" },
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
 * Injects dependencies like styling and polyfills (zone.js).
 */
async function injectStyles(): Promise<void> {
  const stylesUrl = new URL("styles.css", import.meta.url);

  const styleContent = await (await fetch(stylesUrl.href)).text();
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
