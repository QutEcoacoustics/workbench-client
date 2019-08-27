import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/interfaces/pageRouting";
import {
  CreditsComponent,
  DisclaimersComponent,
  EthicsComponent
} from "./about-cms.component";
import { aboutRoute } from "./about.menus";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";

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
