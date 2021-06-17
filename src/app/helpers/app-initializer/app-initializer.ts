import { Inject, Injectable, InjectionToken } from "@angular/core";
import { XOR } from "@helpers/advancedTypes";
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
      ? environment.environment.apiRoot
      : "";
  }
}

/**
 * App values
 */
export interface Values {
  brand: {
    name: string;
    title: string;
  };
  links: {
    sourceRepository: string;
  };
  content: Links[];
}

/**
 * App environment
 */
export interface Environment {
  environment: string;
  apiRoot: string;
  siteRoot: string;
  siteDir: string;
  keys: {
    googleMaps: string;
    googleAnalytics: {
      domain: string;
      trackingId: string;
    };
  };
}

/**
 * External configuration file contents
 */
export interface Configuration {
  kind: "Configuration";
  production: boolean;
  version: string;
  environment: Environment;
  values: Values;
}

/**
 * External configuration.
 * Wrapper to automatically initialize kind key
 */
export class Configuration implements Configuration {
  public kind: "Configuration" = "Configuration";
  public production: boolean;
  public version: string;
  public environment: Environment;
  public values: Values;

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
  function returnError(msg: string) {
    console.error(msg);
    return false;
  }

  function returnParamError(param: string) {
    return returnError(`Invalid configuration ${param} param`);
  }

  if (!config) {
    return returnError("No configuration set");
  }
  if (!config.environment) {
    return returnError("No confirmation environment set");
  }
  if (!config.values) {
    return returnError("No confirmation values set");
  }
  if (config.kind !== "Configuration") {
    return returnParamError("kind");
  }
  if (!validateServerRoot(config.environment.apiRoot, "apiRoot")) {
    return returnParamError("apiRoot");
  }
  if (!validateServerRoot(config.environment.siteRoot, "siteRoot")) {
    return returnParamError("siteRoot");
  }

  const siteUrl = config.environment.siteRoot + config.environment.siteDir;
  if (!isServer && !window.location.toString().includes(siteUrl)) {
    console.warn(
      "Configuration siteRoot and siteDir do not match the current deployment location. Validate this is intentional"
    );
  }

  return true;
}

/**
 * Validate if a server root value is valid for the configuration file
 */
function validateServerRoot(root: string, key: string) {
  if (!root || root.endsWith("/")) {
    return false;
  }

  try {
    const url = new URL(root);
    if (url.protocol === "https:") {
      return true;
    } else if (url.protocol === "http:") {
      console.warn(`Configuration param ${key} is not using https protocol`);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

type Links = XOR<HeaderLink, HeaderDropDownLink>;

/**
 * Determine if a variable is of the HeaderLink type
 *
 * @param link Variable to evaluate
 */
export function isHeaderLink(link: Links): link is HeaderLink {
  return "title" in link;
}

/**
 * Single link for header
 */
export interface HeaderLink {
  title: string;
  url: string;
}

/**
 * Dropdown list of links for header
 */
export interface HeaderDropDownLink {
  headerTitle: string;
  items: HeaderLink[];
}

/**
 * Dropdown list of navigable menu items
 */
export interface HeaderDropDownConvertedLink {
  headerTitle: string;
  items: NavigableMenuItem[];
}
