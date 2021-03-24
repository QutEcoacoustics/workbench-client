import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AnnotationsComponent } from "./annotations/annotations.component";
import { CustomRequestComponent } from "./custom-request/custom-request.component";
import { DataRequestComponent } from "./data-request.component";
import { dataRequestRoute } from "./data-request.menus";

const components = [
  DataRequestComponent,
  AnnotationsComponent,
  CustomRequestComponent,
];
const routes = dataRequestRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class DataRequestModule {}
