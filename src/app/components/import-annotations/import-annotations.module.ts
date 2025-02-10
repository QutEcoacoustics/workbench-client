import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { annotationsImportRoute } from "./import-annotations.routes";
import { AnnotationsListComponent } from "./list/list.component";
import { AnnotationsDetailsComponent } from "./details/details.component";
import { NewAnnotationsComponent } from "./new/new.component";
import { EditAnnotationsComponent } from "./edit/edit.component";
import { AddAnnotationsComponent } from "./add-annotations/add-annotations.component";

const components = [
  // Pages
  AnnotationsListComponent,
  AnnotationsDetailsComponent,
  NewAnnotationsComponent,
  EditAnnotationsComponent,
  AddAnnotationsComponent,
];

const routes = annotationsImportRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: [...components],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AnnotationsImportModule {}
