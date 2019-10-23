import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Configuration } from "./app-config.service";

export let APP_CONFIG = new InjectionToken("app.config");

@Injectable()
export class MockAppConfigService {
  private appConfig: Configuration;
  private testAppConfig: Configuration = {
    environment: {
      apiRoot: "<< apiRoot >>",
      siteRoot: "<< siteRoot >>",
      siteDir: "<< siteDir >>",
      ga: {
        trackingId: "<< placeholder >>"
      }
    },
    values: {
      keys: {
        googleMaps: "<< googleMaps >>"
      },
      brand: {
        name: "<< brandName >>",
        title: "<< brandTitle >>"
      },
      content: [
        {
          title: "<< content >>",
          url: "<< contentUrl >>"
        },
        {
          headerTitle: "<< content >>",
          items: [
            {
              title: "<< content >>",
              url: "<< contentUrl >>"
            },
            {
              title: "<< content >>",
              url: "<< contentUrl >>"
            }
          ]
        }
      ]
    }
  };

  constructor(
    @Inject(APP_CONFIG) private config: string,
    private titleService: Title
  ) {}

  /**
   * Load the application config from the ecosounds website
   */
  async loadAppConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.titleService.setTitle("Testing");
        this.appConfig = this.testAppConfig;

        resolve();
      }, 300);
    });
  }

  /**
   * Get the application config
   */
  getConfig(): any {
    return this.testAppConfig;
  }

  /**
   * Get the url for a url link from the application config
   * @param content Application config
   * @param titles Title of link (titles if link is a subset of another)
   */
  getContentUrl(content: any, titles: string[]): string {
    return "<< contentUrl >>";
  }
}
