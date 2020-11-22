import { Injectable } from "@angular/core";
import {
  Configuration,
  Environment,
  Values,
} from "@helpers/app-initializer/app-initializer";
import { version } from "package.json";

@Injectable()
export class AppConfigMockService {
  public get config(): Configuration {
    return new Proxy(testApiConfig, {});
  }

  public get environment(): Environment {
    return new Proxy(testApiConfig.environment, {});
  }

  public get values(): Values {
    return new Proxy(testApiConfig.values, {});
  }
}

export const testApiConfig = new Configuration({
  production: false,
  version,
  environment: {
    environment: "testing",
    apiRoot: "https://www.testing.com/api",
    siteRoot: "https://www.testing.com/site",
    siteDir: "/website",
    ga: {
      domain: "<< domain >>",
      trackingId: "<< googleAnalytics >>",
    },
  },
  values: {
    keys: {
      googleMaps: "<< googleMaps >>",
    },
    brand: {
      name: "<< brandName >>",
      title: "<< brandTitle >>",
    },
    content: [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>",
      },
      {
        headerTitle: "<< content2 >>",
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
