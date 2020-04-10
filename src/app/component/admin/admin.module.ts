import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { ScriptsModule } from "./scripts/scripts.module";
import { TagGroupsModule } from "./tag-group/tag-groups.module";
import { AdminTagsDeleteComponent } from "./tags/delete/delete.component";
import { AdminTagsEditComponent } from "./tags/edit/edit.component";
import { AdminTagsComponent } from "./tags/list/list.component";
import { AdminTagsNewComponent } from "./tags/new/new.component";
import { AdminUserListComponent } from "./users/list/list.component";

const modules = [ScriptsModule, TagGroupsModule];
const components = [
  AdminDashboardComponent,
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
