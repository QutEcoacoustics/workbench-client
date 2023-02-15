import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { libraryNavRoute } from "./library.menus";
import { AnnotationComponent } from "./pages/details/details.component";
import { LibraryComponent } from "./pages/list/list.component";

const components = [LibraryComponent, AnnotationComponent];

const routes = libraryNavRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class LibraryModule {}
