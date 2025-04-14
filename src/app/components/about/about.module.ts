import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { aboutRoute } from "./about.menus";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { CreditsComponent } from "./pages/credits/credits.component";
import { DisclaimersComponent } from "./pages/disclaimers/disclaimers.component";
import { EthicsComponent } from "./pages/ethics/ethics.component";
import { DataSharingPolicyComponent } from "./pages/data-sharing-policy/data-sharing-policy.component";

const components = [
  ContactUsComponent,
  CreditsComponent,
  DisclaimersComponent,
  EthicsComponent,
  DataSharingPolicyComponent,
];

const routes = aboutRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class AboutModule {}
