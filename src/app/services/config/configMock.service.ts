import { Injectable } from "@angular/core";
import {
  Configuration,
  Endpoints,
  Keys,
  Settings,
} from "@helpers/app-initializer/app-initializer";

@Injectable()
export class AppConfigMockService {
  public get config(): Configuration {
    return new Proxy(testApiConfig, {});
  }

  public get endpoints(): Endpoints {
    return new Proxy(testApiConfig.endpoints, {});
  }

  public get keys(): Keys {
    return new Proxy(testApiConfig.keys, {});
  }

  public get settings(): Settings {
    return new Proxy(testApiConfig.settings, {});
  }
}

export const testApiConfig = new Configuration({
  production: false,
  version: "3.0.0",
  endpoints: {
    environment: "testing",
    apiRoot: "https://www.testing.com/api",
    clientOrigin: "https://www.testing.com/site",
    clientDir: "/website",
  },
  keys: {
    googleMaps: "<< googleMaps >>",
    googleAnalytics: {
      domain: "<< domain >>",
      trackingId: "<< googleAnalytics >>",
    },
  },
  settings: {
    brand: {
      short: "<< brandName >>",
      long: "<< brandTitle >>",
    },
    links: {
      sourceRepository: "http://broken_link",
    },
    customMenu: [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>",
      },
      {
        title: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>",
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>",
          },
        ],
      },
    ],
  },
});
