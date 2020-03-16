import { Inject, Injectable, InjectionToken } from "@angular/core";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";
import { environment } from "src/environments/environment";

export let API_CONFIG = new InjectionToken<Promise<Configuration>>(
  "baw.api.config"
);
export let API_ROOT = new InjectionToken<string>("baw.api.root");
export let CMS_ROOT = new InjectionToken<string>("baw.cms.root");

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  constructor() {}

  static initializerFactory(
    @Inject(API_CONFIG)
    apiEnvironment: Promise<Configuration>
  ) {
    return async () => {
      const config = await apiEnvironment;
      Object.assign(environment, config);
    };
  }

  static apiRootFactory() {
    return isConfiguration(environment) ? environment.environment.apiRoot : "";
  }

  static cmsRootFactory() {
    return isConfiguration(environment) ? environment.environment.cmsRoot : "";
  }
}

/**
 * App CMS pages
 */
export interface CMS {
  credits: string;
  disclaimers: string;
  downloadAnnotations: string;
  ethics: string;
  harvest: string;
  home: string;
  sendAudio: string;
}

/**
 * App values
 */
export interface Values {
  keys: {
    googleMaps: string;
  };
  brand: {
    name: string;
    title: string;
  };
  content: Links[];
  cms: CMS;
}

/**
 * App environment
 */
export interface Environment {
  environment: string;
  apiRoot: string;
  siteRoot: string;
  siteDir: string;
  cmsRoot: string;
  ga: {
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
  environment: Environment;
  values: Values;
}

/**
 * External configuration.
 * Wrapper to automatically initialize kind key
 */
export class Configuration implements Configuration {
  kind: "Configuration" = "Configuration";
  production: boolean;
  version: string;
  environment: Environment;
  values: Values;

  constructor(configuration: Partial<Configuration>) {
    Object.assign(this, configuration);
  }
}

/**
 * Determine if a variable is of the Configuration type
 * @param config Variable to evaluate
 */
export function isConfiguration(
  config: Configuration
): config is Configuration {
  return config.kind === "Configuration";
}

type Links = HeaderLink | HeaderDropDownLink;

/**
 * Determine if a variable is of the HeaderLink type
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
