import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Injectable()
export class MockAppConfigService {
  constructor(private titleService: Title) {
    Object.assign(environment, testConfig);
    this.titleService.setTitle("TESTING");
  }
}

export const testConfig = {
  environment: {
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
    ]
  }
};
