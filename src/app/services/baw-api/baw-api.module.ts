import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppConfigModule } from "../app-config/app-config.module";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";

@NgModule({
  imports: [HttpClientModule, AppConfigModule],
  providers: [
    SecurityService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
  ],
})
export class BawApiModule {}
