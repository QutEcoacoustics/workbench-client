import { Inject, Injectable, InjectionToken } from "@angular/core";
import { NavigableMenuItem } from "@interfaces/menusInterfaces";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export const API_CONFIG = new InjectionToken<Promise<Configuration>>(
  "baw.api.config"
);
export const API_ROOT = new InjectionToken<string>("baw.api.root");

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  public constructor() {}

  public static initializerFactory(
    @Inject(API_CONFIG)
    apiEnvironment: Promise<Configuration>
  ) {
    return async () => {
      const config = await apiEnvironment;
      Object.assign(environment, config);
    };
  }

  public static apiRootFactory(@Inject(IS_SERVER_PLATFORM) isServer: boolean) {
    return isConfiguration(environment, isServer)
      ? environment.endpoints.apiRoot
      : "";
  }
}

/**
 * App values
 */
export interface Settings {
  brand: {
    short: string;
    long: string;
  };
  links: {
    sourceRepository: string;
  };
  customMenu: (HeaderLink | HeaderGroup)[];
}

/**
 * App environment
 */
export interface Endpoints {
  environment: string;
  apiRoot: string;
  clientOrigin: string;
  clientDir: string;
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
export interface Configuration {
  kind: "Configuration";
  production: boolean;
  version: string;
  endpoints: Endpoints;
  keys: Keys;
  settings: Settings;
}

/**
 * External configuration.
 * Wrapper to automatically initialize kind key
 */
export class Configuration implements Configuration {
  public kind: "Configuration" = "Configuration";
  public production: boolean;
  public version: string;
  public endpoints: Endpoints;
  public settings: Settings;

  public constructor(configuration: Partial<Configuration>) {
    Object.assign(this, configuration);
  }
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
    return returnError("No configuration set");
  }
  if (!config.endpoints) {
    return returnError("No confirmation environment set");
  }
  if (!config.settings) {
    return returnError("No confirmation values set");
  }
  if (config.kind !== "Configuration") {
    return returnParamError("kind");
  }
  if (!validateServerRoot(config.endpoints.apiRoot, "apiRoot")) {
    return false;
  }
  if (!validateServerOrigin(config.endpoints.clientOrigin, "clientOrigin")) {
    return false;
  }

  const siteUrl = config.endpoints.clientOrigin + config.endpoints.clientDir;
  if (!isServer && !window.location.toString().includes(siteUrl)) {
    console.warn(
      "Configuration siteRoot and siteDir do not match the current deployment location. Validate this is intentional"
    );
  }

  return true;
}

/**
 * Validate if a server origin is valid for the configuration file
 */
function validateServerOrigin(origin: string, key: string) {
  if (origin?.endsWith("/")) {
    return returnParamError(key, "should not end with a '/'");
  }
  return validateServerRoot(origin, key);
}

/**
 * Validate if a server root value is valid for the configuration file
 */
function validateServerRoot(root: string, key: string) {
  if (!root) {
    return returnParamError(key, "not defined");
  }

  try {
    const url = new URL(root);
    if (url.protocol === "https:") {
      return true;
    } else if (url.protocol === "http:") {
      console.warn(`Configuration param ${key} is not using https protocol`);
      return true;
    } else {
      return returnParamError(key, "url protocol is neither http or https");
    }
  } catch (e) {
    console.error(e);
    return returnParamError(key, "url is not valid");
  }
}

function returnParamError(param: string, msg?: string) {
  return returnError(
    `Invalid configuration ${param} param${msg ? `: ${msg}` : ""}`
  );
}

function returnError(msg: string) {
  console.error(msg);
  return false;
}

/**
 * Determine if a variable is of the HeaderLink type
 *
 * @param link Variable to evaluate
 */
export function isHeaderLink(
  link: HeaderLink | HeaderGroup | HeaderGroupConverted
): link is HeaderLink {
  return "url" in (link as HeaderLink);
}

/**
 * Single link for header
 */
export interface HeaderLink {
  title: string;
  /**
   * Override of title, allows insertion of images/icons
   * TODO Implement when required
   */
  html?: string;
  url: string;
}

/**
 * Dropdown list of links for header
 */
export interface HeaderGroup {
  title: string;
  /**
   * Override of title, allows insertion of images/icons
   * TODO Implement when required
   */
  html?: string;
  items: HeaderLink[];
}

/**
 * Dropdown list of navigable menu items
 */
export interface HeaderGroupConverted {
  title: string;
  /**
   * Override of title, allows insertion of images/icons
   * TODO Implement when required
   */
  html?: string;
  items: NavigableMenuItem[];
}
