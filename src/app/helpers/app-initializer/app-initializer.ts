import { Inject, Injectable, InjectionToken } from "@angular/core";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";
import { environment } from "src/environments/environment";

export let API_ENVIRONMENT = new InjectionToken<
  Promise<Environment | ErrorEnvironment>
>("baw.api.config");
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
    @Inject(API_ENVIRONMENT)
    apiEnvironment: Promise<Environment | ErrorEnvironment>
  ) {
    return async () => {
      const config = await apiEnvironment;
      Object.assign(environment, config);
    };
  }

  static apiRootFactory() {
    return !isErrorConfiguration(environment)
      ? environment.environment.apiRoot
      : "";
  }

  static cmsRootFactory() {
    return !isErrorConfiguration(environment)
      ? environment.environment.cmsRoot
      : "";
  }
}

export interface EnvironmentValues {
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

export interface EnvironmentRoots {
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
export interface Environment {
  kind: "Environment";
  production: boolean;
  version: string;
  environment: EnvironmentRoots;
  values: EnvironmentValues;
}

export interface ErrorEnvironment {
  kind: "ErrorEnvironment";
}

export function isErrorConfiguration(
  config: Environment | ErrorEnvironment
): config is ErrorEnvironment {
  return config.kind === "ErrorEnvironment";
}

export interface CMS {
  credits: string;
  disclaimers: string;
  downloadAnnotations: string;
  ethics: string;
  harvest: string;
  home: string;
  sendAudio: string;
}

type Links = HeaderLink | HeaderDropDownLink;

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
