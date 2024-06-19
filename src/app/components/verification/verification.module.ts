import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { StrongRoute } from "@interfaces/strongRoute";
import { verificationRoute } from "./verification.routes";
import { NewVerificationComponent } from "./pages/new/new.component";
import { ViewVerificationComponent } from "./pages/view/view.component";
import { AnnotationSearchPreviewComponent } from "./components/annotation-search-preview/annotation-search-preview.component";

const internalComponents = [
  AnnotationSearchPreviewComponent,
];

const components = [
  NewVerificationComponent,
  ViewVerificationComponent,
];

const routes = Object.values(verificationRoute)
  .map((route: StrongRoute) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  declarations: [...internalComponents, ...components],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerificationModule {}
