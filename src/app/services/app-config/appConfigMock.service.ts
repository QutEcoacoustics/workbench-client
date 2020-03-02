import { Injectable } from "@angular/core";
import { version } from "package.json";
import {
  Configuration,
  Environment,
  Values
} from "src/app/helpers/app-initializer/app-initializer";

@Injectable()
export class AppConfigMockService {
  get config(): Configuration {
    return new Proxy(testApiConfig, {});
  }

  get environment(): Environment {
    return new Proxy(testApiConfig.environment, {});
  }

  get values(): Values {
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
    siteDir: "<< siteDir >>",
    cmsRoot: "https://www.testing.com/cms",
    ga: {
      trackingId: "<< googleAnalytics >>"
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
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          }
        ]
      }
    ],
    cms: {
      credits: "/credits.html",
      disclaimers: "/disclaimers.html",
      downloadAnnotations: "/downloadAnnotations.html",
      ethics: "/ethics.html",
      harvest: "/harvest.html",
      home: "/home.html",
      sendAudio: "/sendAudio.html"
    }
  }
});
