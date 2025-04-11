import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { websiteStatusRoute } from "./website-status.routes";
import { WebsiteStatusComponent } from "./website-status.component";

const components = [WebsiteStatusComponent];
const routes = websiteStatusRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class WebsiteStatusModule {}
