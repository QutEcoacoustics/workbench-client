import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

export let APP_CONFIG = new InjectionToken("app.config");

@Injectable()
export class AppConfigService {
  private appConfig: Configuration;

  constructor(
    @Inject(APP_CONFIG) private config: string,
    private titleService: Title
  ) {}

  /**
   * Load the application config from the ecosounds website
   */
  async loadAppConfig(): Promise<any> {
    // Using fetch because HttpClient fails. Could be an issue due
    // to the use of a HttpInterceptor:
    // https://github.com/rfreedman/angular-configuration-service/issues/1
    await fetch(this.config)
      .then(response => response.json())
      .then(data => {
        this.appConfig = data;
        this.titleService.setTitle(data.values.brand.name);
      })
      .catch(() => {
        this.appConfig = undefined;
      });
  }

  /**
   * Get the application config
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
    apiRoot: string;
    siteRoot: string;
    siteDir: string;
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

function isHeaderLink(link: Links): link is HeaderLink {
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
  items: HeaderLink[] | NavigableMenuItem[];
}

/**
 * Dropdown list of navigable menu items
 * @extends HeaderDropDownLink
 */
export interface HeaderDropDownConvertedLink extends HeaderDropDownLink {
  items: NavigableMenuItem[];
}
