import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminScriptsComponent } from "./scripts/list/list.component";
import { AdminScriptsNewComponent } from "./scripts/new/new.component";
import { AdminUserListComponent } from "./users/list/list.component";

const components = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminScriptsComponent,
  AdminScriptsNewComponent
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
