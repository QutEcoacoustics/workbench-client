import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { annotationsImportRoute } from "./import-annotations.routes";
import { AnnotationsListComponent } from "./list/list.component";
import { AnnotationImportDetailsComponent } from "./details/details.component";
import { NewAnnotationsComponent } from "./new/new.component";
import { EditAnnotationsComponent } from "./edit/edit.component";
import { AddAnnotationsComponent } from "./add-annotations/add-annotations.component";

const components = [
  // Pages
  AnnotationsListComponent,
  AnnotationImportDetailsComponent,
  NewAnnotationsComponent,
  EditAnnotationsComponent,
  AddAnnotationsComponent,
];

const routes = annotationsImportRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class AnnotationsImportModule {}
