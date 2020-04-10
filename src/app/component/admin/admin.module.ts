import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminTagGroupsDeleteComponent } from "./tag-group/delete/delete.component";
import { AdminTagGroupsEditComponent } from "./tag-group/edit/edit.component";
import { AdminTagGroupsComponent } from "./tag-group/list/list.component";
import { AdminTagGroupsNewComponent } from "./tag-group/new/new.component";
import { AdminTagsDeleteComponent } from "./tags/delete/delete.component";
import { AdminTagsEditComponent } from "./tags/edit/edit.component";
import { AdminTagsComponent } from "./tags/list/list.component";
import { AdminTagsNewComponent } from "./tags/new/new.component";
import { AdminUserListComponent } from "./users/list/list.component";
import { ScriptsModule } from "./scripts/scripts.module";

const modules = [ScriptsModule];
const components = [
  AdminDashboardComponent,
  AdminTagGroupsComponent,
  AdminTagGroupsDeleteComponent,
  AdminTagGroupsEditComponent,
  AdminTagGroupsNewComponent,
  AdminTagsComponent,
  AdminTagsDeleteComponent,
  AdminTagsEditComponent,
  AdminTagsNewComponent,
  AdminUserListComponent,
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes), ...modules],
  exports: [RouterModule, ...components, ...modules],
})
export class AdminModule {}
