import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { StrongRoute } from "@interfaces/strongRoute";
import { verificationRoute } from "./annotation.routes";
import { AnnotationSearchFormComponent } from "./components/annotation-search-form/annotation-search-form.component";
import { AnnotationSearchComponent } from "./pages/search/search.component";
import { VerificationComponent } from "./pages/verification/verification.component";

const internalComponents = [AnnotationSearchFormComponent];

const components = [
  AnnotationSearchComponent,
  VerificationComponent,
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
export class AnnotationModule {}
