import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { StrongRoute } from "@interfaces/strongRoute";
import { verificationRoute } from "./annotation.routes";
import { VerificationComponent } from "./pages/verification/verification.component";
import { ResetProgressWarningComponent } from "./components/reset-progress-warning/reset-progress-warning.component";
import { AnnotationSearchFormComponent } from "./components/annotation-search-form/annotation-search-form.component";
import { AnnotationSearchComponent } from "./pages/search/search.component";
import { SearchFiltersModalComponent } from "./components/search-filters-modal/search-filters-modal.component";
import { FiltersWarningModalComponent } from "./components/broad-filters-warning/broad-filters-warning.component";

const internalComponents = [
  SearchFiltersModalComponent,
  ResetProgressWarningComponent,
  FiltersWarningModalComponent,
  AnnotationSearchFormComponent,
];

const internalModules = [];

const components = [VerificationComponent, AnnotationSearchComponent];

const routes = Object.values(verificationRoute)
  .map((route: StrongRoute) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  declarations: [...internalComponents, ...components],
  imports: [SharedModule, RouterModule.forChild(routes), ...internalModules],
  exports: [RouterModule, ...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotationModule {}
