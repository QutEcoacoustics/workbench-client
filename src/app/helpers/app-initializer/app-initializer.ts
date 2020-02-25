import { Inject, Injectable, InjectionToken } from "@angular/core";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";
import { environment } from "src/environments/environment";

export let API_CONFIG = new InjectionToken("baw.api.config");
export let API_ROOT = new InjectionToken("baw.api.root");
export let CMS_ROOT = new InjectionToken("baw.cms.root");
export let CMS_DATA = new InjectionToken("baw.cms.data");

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  constructor() {}

  static initializerFactory(
    @Inject(API_CONFIG) apiConfig: Promise<Configuration>
  ) {
    return async () => {
      const config = await apiConfig;
      Object.assign(environment, config);
    };
  }

  static apiRootFactory() {
    return environment.environment.apiRoot;
  }

  static cmsRootFactory() {
    return environment.environment.cmsRoot;
  }

  static cmsDataFactory() {
    return environment.values.cms;
  }
}

/**
 * External configuration file contents
 */
export interface Configuration {
  production: boolean;
  version: string;
  environment: {
    environment: string;
    apiRoot: string;
    siteRoot: string;
    siteDir: string;
    cmsRoot: string;
    ga: {
      trackingId: string;
    };
  };
  values: {
    keys: {
      googleMaps: string;
    };
    brand: {
      name: string;
      title: string;
    };
    content: Links[];
    cms: CMS;
  };
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
