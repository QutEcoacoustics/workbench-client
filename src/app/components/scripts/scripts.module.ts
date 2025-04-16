import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { AdminScriptComponent } from "./details/details.component";
import { AdminScriptsEditComponent } from "./edit/edit.component";
import { AdminScriptsComponent } from "./list/list.component";
import { AdminScriptsNewComponent } from "./new/new.component";
import { scriptsRoute } from "./scripts.routes";

const pages = [
  AdminScriptsComponent,
  AdminScriptComponent,
  AdminScriptsNewComponent,
  AdminScriptsEditComponent,
];
const routes = scriptsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class ScriptsModule {}
