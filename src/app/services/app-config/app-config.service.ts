import {
  APP_INITIALIZER,
  Inject,
  Injectable,
  InjectionToken
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

const environmentUrl = "assets/environment.json";

export let API_ROOT = new InjectionToken("baw.api.root");
export let API_CONFIG = new InjectionToken("baw.api.config");

export function apiRootFactory(appConfig: AppConfigService) {
  return appConfig.getConfig().environment.apiRoot;
}

@Injectable({
  providedIn: "root"
})
export class AppConfigService {
  constructor(
    private titleService: Title,
    @Inject(API_CONFIG) private appConfig: Configuration
  ) {
    console.log("API_CONFIG Output: ", this.appConfig);

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
