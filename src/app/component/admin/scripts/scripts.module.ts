import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AdminScriptsDeleteComponent } from "./delete/delete.component";
import { AdminScriptComponent } from "./details/details.component";
import { AdminScriptsEditComponent } from "./edit/edit.component";
import { AdminScriptsComponent } from "./list/list.component";
import { AdminScriptsNewComponent } from "./new/new.component";
import { adminScriptsRoute } from "./scripts.menus";

const components = [
  AdminScriptsComponent,
  AdminScriptComponent,
  AdminScriptsNewComponent,
  AdminScriptsEditComponent,
  AdminScriptsDeleteComponent,
];
const routes = adminScriptsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ScriptsModule {}
