import { NgModule } from "@angular/core";
import {
  API_CONFIG,
  API_ROOT,
  CMS_ROOT,
  Configuration,
} from "@helpers/app-initializer/app-initializer";
import { AppConfigService } from "./app-config.service";
import { AppConfigMockService, testApiConfig } from "./appConfigMock.service";
@NgModule({
  providers: [
    {
      provide: API_ROOT,
      useValue: testApiConfig.environment.apiRoot,
    },
    {
      provide: CMS_ROOT,
      useValue: testApiConfig.environment.cmsRoot,
    },
    {
      provide: API_CONFIG,
      useValue: new Promise<Configuration>((resolve) => {
        resolve(testApiConfig);
      }),
    },
    {
      provide: AppConfigService,
      useClass: AppConfigMockService,
    },
  ],
})
export class MockAppConfigModule {}
