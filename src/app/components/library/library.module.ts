import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { libraryRoute } from "./library.menus";
import { AnnotationComponent } from "./pages/details/details.component";
import { LibraryComponent } from "./pages/list/list.component";

const components = [LibraryComponent, AnnotationComponent];

const routes = libraryRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class LibraryModule {}
