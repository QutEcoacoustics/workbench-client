import { Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

const environmentUrl = "assets/environment.json";

export let API_ROOT = new InjectionToken("baw.api.root");
export function apiRootFactory(appConfig: AppConfigService) {
  return appConfig.getConfig().environment.apiRoot;
}
export function appInitializerFn(appConfig: AppConfigService) {
  return () => appConfig.loadAppConfig();
}

@Injectable()
export class AppConfigService {
  /**
   * App external config
   */
  private appConfig: Configuration;

  constructor(private titleService: Title) {}

  /**
   * Load the application config from the ecosounds website
   */
  async loadAppConfig(): Promise<any> {
    // Using fetch because HttpClient fails. Could be an issue due
    // to the use of a HttpInterceptor:
    // https://github.com/rfreedman/angular-configuration-service/issues/1

    const handleData = (data: Configuration) => {
      this.appConfig = data;
      this.titleService.setTitle(data.values.brand.name);
      return this.appConfig;
    };

    const handleError = (err: any) => {
      this.appConfig = undefined;
      console.error("AppConfigService: ", err);
      throw new Error("AppConfigService: Failed to load configuration file");
    };
    return retrieveAppConfig(handleData, handleError);
  }

  /**
   * Get the application config.
   * If config unknown/null, error has occurred.
   */
  getConfig(): Configuration {
    return this.appConfig;
  }

  /**
   * Get the url for a url link from the application config
   * @param content Application config
   * @param titles Title of link (titles if link is a subset of another)
   */
  getContentUrl(content: any, titles: string[]) {
    for (const header of content) {
      if (titles.length === 1) {
        if (isHeaderLink(header) && header.title === titles[0]) {
          return header.url;
        }
      } else if (!isHeaderLink(header) && header.headerTitle === titles[0]) {
        return this.getContentUrl(header.items, titles.slice(1, titles.length));
      }
    }

    // Return empty url if not found
    return "#";
  }
}

/**
 * Retrieve app external config
 * @param config Config location
 * @param dataFunc Handle config
 * @param catchFunc Handle failure
 */
export async function retrieveAppConfig(
  dataFunc: (data: Configuration) => Configuration,
  catchFunc: (err: any) => null
) {
  return await fetch(environmentUrl)
    .then(response => response.json())
    .then(dataFunc)
    .catch(catchFunc);
}

/**
 * External configuration file contents
 */
export interface Configuration {
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
  };
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
