import { Injectable } from "@angular/core";
import { Configuration, Endpoints, Keys, Settings } from "@helpers/app-initializer/app-initializer";
import { websiteHttpUrl } from "@test/helpers/url";
import { environment } from "src/environments/environment";
import { assetRoot } from "./config.service";

@Injectable()
export class ConfigMockService {
  public get environment() {
    return new Proxy(environment, {});
  }

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
  endpoints: {
    environment: "testing",
    apiRoot: "https://www.testing.com/api",
    clientOrigin: "https://www.testing.com/site",
    clientDir: "/website",
    oldClientOrigin: websiteHttpUrl,
    oldClientBase: `${assetRoot}/old-client/index.html`,
  },
  keys: {
    googleMaps: "mock-api-key",
    googleAnalytics: {
      domain: "",
      trackingId: "",
    },
  },
  settings: {
    brand: {
      short: "<< brandShort >>",
      long: "<< brandLong >>",
      organization: "<< brandOrganization >>",
    },
    links: {
      sourceRepository: "http://broken_link",
      sourceRepositoryIssues: "http://broken_link",
      harvestFilenameGuide: "http://broken_link",
    },
    hideProjects: false,
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
