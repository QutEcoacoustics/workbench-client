import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AdminTagsEditComponent } from "./edit/edit.component";
import { AdminTagsComponent } from "./list/list.component";
import { AdminTagsNewComponent } from "./new/new.component";
import { adminTagsRoute } from "./tags.menus";

const components = [AdminTagsComponent, AdminTagsEditComponent, AdminTagsNewComponent];
const routes = adminTagsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class TagsModule {}
