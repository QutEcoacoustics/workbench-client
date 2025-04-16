import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { AdminTagsEditComponent } from "./edit/edit.component";
import { AdminTagsComponent } from "./list/list.component";
import { AdminTagsNewComponent } from "./new/new.component";
import { adminTagsRoute } from "./tags.menus";

const pages = [
  AdminTagsComponent,
  AdminTagsEditComponent,
  AdminTagsNewComponent,
];
const routes = adminTagsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class TagsModule {}
