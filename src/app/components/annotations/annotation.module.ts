import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { StrongRoute } from "@interfaces/strongRoute";
import { verificationRoute } from "./annotation.routes";
import { VerificationComponent } from "./pages/verification/verification.component";
import { ProgressWarningComponent } from "./components/modals/progress-warning/progress-warning.component";
import { AnnotationSearchFormComponent } from "./components/annotation-search-form/annotation-search-form.component";
import { AnnotationSearchComponent } from "./pages/search/search.component";
import { SearchFiltersModalComponent } from "./components/modals/search-filters/search-filters.component";
import { FiltersWarningModalComponent } from "./components/modals/filters-warning/filters-warning.component";

const internalComponents = [
  SearchFiltersModalComponent,
  ProgressWarningComponent,
  FiltersWarningModalComponent,
  AnnotationSearchFormComponent,
];

const internalModules = [];

const components = [VerificationComponent, AnnotationSearchComponent];

const routes = Object.values(verificationRoute)
  .map((route: StrongRoute) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ...internalModules,
    ...internalComponents,
    ...components,
  ],
  exports: [RouterModule, ...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotationModule {}
