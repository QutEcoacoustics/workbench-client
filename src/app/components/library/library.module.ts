import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { libraryRoute } from "./library.menus";
import { AnnotationComponent } from "./pages/details/details.component";
import { LibraryComponent } from "./pages/list/list.component";

const pages = [LibraryComponent, AnnotationComponent];
const routes = libraryRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class LibraryModule {}
