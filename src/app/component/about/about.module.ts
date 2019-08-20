import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/interfaces/pageRouting";
import { aboutRoute } from "./about.menus";
import { ContactUsComponent } from "./contact-us/contact-us.component";

export const AboutComponents = [ContactUsComponent];

const routes = aboutRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: AboutComponents,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...AboutComponents]
})
export class AboutModule {}
