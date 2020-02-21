import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

export let API_ROOT = new InjectionToken("baw.api.root");
export let API_CONFIG = new InjectionToken("baw.api.config");

export function apiRootFactory(appConfig: AppConfigService) {
  return appConfig.getConfig().environment.apiRoot;
}

/**
 * App Initializer class.
 * Class is a wrapper for the factory function as error handler
 * forbids injection on functions even though its supported.
 */
@Injectable()
export class AppInitializer {
  constructor() {}

  static appInitializerFactory(
    @Inject(API_CONFIG) apiConfig: Promise<Configuration>
  ) {
    return async () => {
      // Wait for promise to resolve
      const config = await apiConfig;

      // Override apiConfig with config data
      for (const key of Object.keys(apiConfig)) {
        delete apiConfig[key];
      }
      Object.assign(apiConfig, config);
      return;
    };
  }
}

@Injectable({
  providedIn: "root"
})
export class AppConfigService {
  constructor(
    private titleService: Title,
    @Inject(API_CONFIG) private appConfig: Configuration
  ) {
    this.titleService.setTitle(this.appConfig.values.brand.name);
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
