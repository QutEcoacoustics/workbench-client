import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminScriptsNewComponent } from "./scripts-new/scripts-new.component";
import { AdminScriptsComponent } from "./scripts/scripts.component";
import { AdminTagsDeleteComponent } from "./tags/delete/delete.component";
import { AdminTagsEditComponent } from "./tags/edit/edit.component";
import { AdminTagsComponent } from "./tags/list/list.component";
import { AdminTagsNewComponent } from "./tags/new/new.component";
import { AdminUserListComponent } from "./user-list/user-list.component";

const components = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminScriptsComponent,
  AdminScriptsNewComponent,
  AdminTagsComponent,
  AdminTagsNewComponent,
  AdminTagsEditComponent,
  AdminTagsDeleteComponent
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
