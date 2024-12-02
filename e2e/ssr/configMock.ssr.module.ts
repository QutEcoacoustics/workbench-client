import { NgModule } from "@angular/core";
import { Configuration } from "@helpers/app-initializer/app-initializer";
import { ConfigService } from "@services/config/config.service";
import { API_CONFIG, API_ROOT } from "@services/config/config.tokens";
import { ConfigMockService, ssrTestApiConfig } from "@services/config/configMock.service";

@NgModule({
  providers: [
    {
      provide: API_ROOT,
      useValue: ssrTestApiConfig.endpoints.apiRoot,
    },
    {
      provide: API_CONFIG,
      useValue: new Promise<Configuration>((resolve) => {
        resolve(ssrTestApiConfig);
      }),
    },
    {
      provide: ConfigService,
      useClass: ConfigMockService,
    },
  ],
})
export class MockConfigModule {}
