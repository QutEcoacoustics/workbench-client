import { NgModule } from "@angular/core";
import {
  API_CONFIG,
  API_ROOT,
  Configuration,
} from "@helpers/app-initializer/app-initializer";
import { ConfigService } from "./config.service";
import { AppConfigMockService, testApiConfig } from "./configMock.service";
@NgModule({
  providers: [
    {
      provide: API_ROOT,
      useValue: testApiConfig.endpoints.apiRoot,
    },
    {
      provide: API_CONFIG,
      useValue: new Promise<Configuration>((resolve) => {
        resolve(testApiConfig);
      }),
    },
    {
      provide: ConfigService,
      useClass: AppConfigMockService,
    },
  ],
})
export class MockAppConfigModule {}
