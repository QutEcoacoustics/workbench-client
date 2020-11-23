import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { aboutRoute } from "./about.menus";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { CreditsComponent } from "./pages/credits/credits.component";
import { DisclaimersComponent } from "./pages/disclaimers/disclaimers.component";
import { EthicsComponent } from "./pages/ethics/ethics.component";

const components = [
  ContactUsComponent,
  CreditsComponent,
  DisclaimersComponent,
  EthicsComponent,
];

const routes = aboutRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AboutModule {}
