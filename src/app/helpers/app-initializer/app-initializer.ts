import { Inject, Injectable, Optional } from "@angular/core";
import { ConfigService } from "@services/config/config.service";
import { API_CONFIG } from "@services/config/config.tokens";
import { BawTheme } from "@services/theme/theme.service";

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  public static initializerFactory(
    // SSR Sets a default config
    @Optional() @Inject(API_CONFIG) config: Promise<Configuration>,
    configService: ConfigService
  ): () => Promise<void> {
    return async (): Promise<void> => configService.init(config);
  }

  public static apiRootFactory(configService: ConfigService): string {
    return configService.endpoints.apiRoot;
  }
}

export interface Brand {
  short: string;
  long: string;
  organization: string;
}

/**
 * App values
 */
export interface Settings {
  brand: Brand;
  links: {
    sourceRepository: string;
    sourceRepositoryIssues: string;
    harvestFilenameGuide: string;
  };
  hideProjects: boolean;
  customMenu: CustomMenuItem[];
  theme?: BawTheme;
}

/**
 * App environment
 */
export interface Endpoints {
  environment: string;
  apiRoot: string;
  clientOrigin: string;
  clientDir: string;
  oldClientOrigin: string;
  oldClientBase: string;
}

export interface Keys {
  googleMaps: string;
  googleAnalytics: {
    domain: string;
    trackingId: string;
  };
}

/**
 * External configuration file contents
 */
export interface IConfiguration {
  kind: "Configuration";
  endpoints: Endpoints;
  settings: Settings;
  keys: Keys;
}

/**
 * External configuration.
 * Wrapper to automatically initialize kind key
 */
export class Configuration implements IConfiguration {
  public kind = "Configuration" as const;
  public endpoints: Endpoints;
  public settings: Settings;
  public keys: Keys;

  public constructor(configuration: Partial<IConfiguration>) {
    Object.assign(this, configuration);
  }
}

function failure(msg: string): false {
  console.error(msg);
  return false;
}

function paramFailure(param: string, msg?: string): false {
  return failure(
    `Invalid configuration ${param} param${msg ? `: ${msg}` : ""}`
  );
}

function success(): true {
  return true;
}

/**
 * Determine if a variable is of the Configuration type
 *
 * @param config Variable to evaluate
 */
export function isConfiguration(
  config: Configuration,
  isServer: boolean
): config is Configuration {
  if (!config) {
    return failure("No configuration set");
  }
  if (!config.endpoints) {
    return paramFailure("endpoints", "no value set");
  }
  if (!config.keys) {
    return paramFailure("keys", "no value set");
  }
  if (!config.settings) {
    return paramFailure("settings", "no value set");
  }
  if (config.kind !== "Configuration") {
    return paramFailure("kind");
  }
  if (!validateServerRoot(config.endpoints.apiRoot, "apiRoot")) {
    return paramFailure("apiRoot");
  }
  if (!validateServerOrigin(config.endpoints.clientOrigin, "clientOrigin")) {
    return paramFailure("clientOrigin");
  }

  const siteUrl = config.endpoints.clientOrigin + config.endpoints.clientDir;
  if (!isServer && !window.location.toString().includes(siteUrl)) {
    console.warn(
      "Configuration siteRoot and siteDir do not match the current deployment location. Validate this is intentional"
    );
  }

  return success();
}

/**
 * Validate if a server origin is valid for the configuration file
 */
function validateServerOrigin(origin: string, key: string) {
  if (origin?.endsWith("/")) {
    return paramFailure(key, "should not end with a '/'");
  }
  return validateServerRoot(origin, key);
}

/**
 * Validate if a server root value is valid for the configuration file
 */
function validateServerRoot(root: string, key: string) {
  if (!root) {
    return paramFailure(key, "not defined");
  }

  try {
    const url = new URL(root);
    if (url.protocol === "https:") {
      return success();
    } else if (url.protocol === "http:") {
      console.warn(`Configuration param ${key} is not using https protocol`);
      return success();
    } else {
      return paramFailure(key, "url protocol is neither http or https");
    }
  } catch (e) {
    console.error(e);
    return paramFailure(key, "url is not valid");
  }
}

export interface CustomMenuItem {
  title: string;
  url?: string;
  items?: CustomMenuItem[];
}
