import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { AdminTagGroupsEditComponent } from "./edit/edit.component";
import { AdminTagGroupsComponent } from "./list/list.component";
import { AdminTagGroupsNewComponent } from "./new/new.component";
import { adminTagGroupsRoute } from "./tag-group.menus";

const components = [
  AdminTagGroupsComponent,
  AdminTagGroupsEditComponent,
  AdminTagGroupsNewComponent,
];
const routes = adminTagGroupsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class TagGroupsModule {}
