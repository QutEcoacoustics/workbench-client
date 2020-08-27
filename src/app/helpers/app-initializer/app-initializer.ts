import { Inject, Injectable, InjectionToken } from "@angular/core";
import { XOR } from "@helpers/advancedTypes";
import { NavigableMenuItem } from "@interfaces/menusInterfaces";
import { environment } from "src/environments/environment";

export let API_CONFIG = new InjectionToken<Promise<Configuration>>(
  "baw.api.config"
);
export let API_ROOT = new InjectionToken<string>("baw.api.root");

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  constructor() {}

  public static initializerFactory(
    @Inject(API_CONFIG)
    apiEnvironment: Promise<Configuration>
  ) {
    return async () => {
      const config = await apiEnvironment;
      Object.assign(environment, config);
    };
  }

  public static apiRootFactory() {
    return isConfiguration(environment)
      ? environment?.environment?.apiRoot
      : "";
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
  ga: {
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
  const hasKind = config?.kind === "Configuration";
  const hasEnvironment = !!config?.environment;
  const hasValues = !!config?.values;
  const hasApiRoot = !!config?.environment?.apiRoot;

  return hasKind && hasEnvironment && hasValues && hasApiRoot;
}

type Links = XOR<HeaderLink, HeaderDropDownLink>;

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
