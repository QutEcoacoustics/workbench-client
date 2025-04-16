import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { websiteStatusRoute } from "./website-status.routes";
import { WebsiteStatusComponent } from "./website-status.component";

const pages = [WebsiteStatusComponent];
const routes = websiteStatusRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class WebsiteStatusModule {}
