import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AdminScriptComponent } from "./details/details.component";
import { AdminScriptsEditComponent } from "./edit/edit.component";
import { AdminScriptsComponent } from "./list/list.component";
import { AdminScriptsNewComponent } from "./new/new.component";
import { scriptsRoute } from "./scripts.routes";

const components = [AdminScriptsComponent, AdminScriptComponent, AdminScriptsNewComponent, AdminScriptsEditComponent];
const routes = scriptsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ScriptsModule {}
