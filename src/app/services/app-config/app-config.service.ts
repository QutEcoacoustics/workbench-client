import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";

export let APP_CONFIG = new InjectionToken("app.config");

@Injectable()
export class AppConfigService {
  private appConfig: any;

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
    const response = await fetch(this.config);
    const data = await response.json();
    this.appConfig = data;
    this.titleService.setTitle(this.appConfig.values.brand.name);
  }

  /**
   * Get the application config
   */
  getConfig(): any {
    return this.appConfig;
  }

  /**
   * Get the url for a url link from the application config
   * @param content Application config
   * @param titles Title of link (titles if link is a subset of another)
   */
  getContentUrl(content: any, titles: string[]): string {
    content.forEach(header => {
      if (titles.length === 1) {
        if (header.title && header.title === titles[0]) {
          return header.url;
        } else {
          return "";
        }
      } else if (header.header_title && header.header_title === titles[0]) {
        return this.getContentUrl(
          header.items,
          titles.slice(1, titles.length - 1)
        );
      }
    });

    // Return empty url if not found
    return "#";
  }
}
