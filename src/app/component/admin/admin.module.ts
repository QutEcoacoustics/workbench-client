import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminScriptsNewComponent } from "./scripts-new/scripts-new.component";
import { AdminScriptsComponent } from "./scripts/scripts.component";
import { AdminTagGroupsDeleteComponent } from "./tag-group/delete/delete.component";
import { AdminTagGroupsEditComponent } from "./tag-group/edit/edit.component";
import { AdminTagGroupsComponent } from "./tag-group/list/list.component";
import { AdminTagGroupsNewComponent } from "./tag-group/new/new.component";
import { AdminUserListComponent } from "./user-list/user-list.component";

const components = [
  AdminDashboardComponent,
  AdminScriptsComponent,
  AdminScriptsNewComponent,
  AdminTagGroupsComponent,
  AdminTagGroupsDeleteComponent,
  AdminTagGroupsEditComponent,
  AdminTagGroupsNewComponent,
  AdminUserListComponent
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
