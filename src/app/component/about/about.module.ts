import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { aboutRoute } from "./about.menus";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { CreditsComponent } from "./pages/credits/credits.component";
import { DisclaimersComponent } from "./pages/disclaimers/disclaimers.component";
import { EthicsComponent } from "./pages/ethics/ethics.component";

export const AboutComponents = [
  ContactUsComponent,
  CreditsComponent,
  DisclaimersComponent,
  EthicsComponent
];

const routes = aboutRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: AboutComponents,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...AboutComponents]
})
export class AboutModule {}
